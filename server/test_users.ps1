$ErrorActionPreference = 'Stop'

function Get-Token($phone, $password) {
    $body = @{ phone = $phone; password = $password } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri http://localhost:5000/api/auth/login -Method Post -ContentType "application/json" -Body $body
    return $response.data.token
}

function Test-Endpoint($name, $method, $uri, $token, $bodyStr, $expectedStatus) {
    Write-Host "`n=== Testing: $name ==="
    $headers = @{}
    if ($token) { $headers['Authorization'] = "Bearer $token" }
    if ($bodyStr) { $headers['Content-Type'] = "application/json" }

    try {
        if ($bodyStr) {
            $response = Invoke-RestMethod -Uri $uri -Method $method -Headers $headers -Body $bodyStr -SkipHttpErrorCheck
        } else {
            $response = Invoke-RestMethod -Uri $uri -Method $method -Headers $headers -SkipHttpErrorCheck
        }
        # In PowerShell 5, SkipHttpErrorCheck doesn't work, so it will throw.
        # But we will use try/catch to catch it.
    } catch {
        $status = $_.Exception.Response.StatusCode.value__
        if ($status -eq $expectedStatus) {
            Write-Host "SUCCESS: Got expected status $status" -ForegroundColor Green
        } else {
            Write-Host "FAIL: Expected $expectedStatus but got $status" -ForegroundColor Red
        }
        return
    }

    # If we are here, it didn't throw (status 200 or 201)
    if (200 -eq $expectedStatus -or 201 -eq $expectedStatus) {
        Write-Host "SUCCESS: Got expected success status" -ForegroundColor Green
        return $response
    } else {
        Write-Host "FAIL: Expected $expectedStatus but request succeeded" -ForegroundColor Red
    }
}

Write-Host "Fetching tokens..."
$adminToken = Get-Token "9999999999" "123456"
$opToken = Get-Token "9876543210" "123456"
$vilToken = Get-Token "7654321098" "123456"

# 1. No token -> 401
Test-Endpoint "GET /api/users (No Token)" "GET" "http://localhost:5000/api/users" "" "" 401

# 2. Operator token -> 403
Test-Endpoint "GET /api/users (Operator)" "GET" "http://localhost:5000/api/users" $opToken "" 403

# 3. Villager token -> 403
Test-Endpoint "GET /api/users (Villager)" "GET" "http://localhost:5000/api/users" $vilToken "" 403

# 4. Admin token -> 200
$usersRes = Test-Endpoint "GET /api/users (Admin)" "GET" "http://localhost:5000/api/users" $adminToken "" 200
Write-Host "Total users:" $usersRes.pagination.total

# 5. Search
$searchRes = Test-Endpoint "GET /api/users?search=Admin (Admin)" "GET" "http://localhost:5000/api/users?search=Admin" $adminToken "" 200
Write-Host "Search results:" $searchRes.data.Count

# 6. Create User
$newUserId = "U-TEST-" + (Get-Random -Maximum 9999)
$newUserPhone = "5555" + (Get-Random -Maximum 999999)
$createBody = @{ userId = $newUserId; name = "Test User"; phone = $newUserPhone; password = "password"; role = "villager" } | ConvertTo-Json
$created = Test-Endpoint "POST /api/users (Admin)" "POST" "http://localhost:5000/api/users" $adminToken $createBody 201
$dbId = $created.data._id
Write-Host "Created User ID:" $dbId

# 7. Get User by ID
Test-Endpoint "GET /api/users/:id" "GET" "http://localhost:5000/api/users/$dbId" $adminToken "" 200 | Out-Null

# 8. Update User
$updateBody = @{ name = "Updated Test User" } | ConvertTo-Json
Test-Endpoint "PUT /api/users/:id" "PUT" "http://localhost:5000/api/users/$dbId" $adminToken $updateBody 200 | Out-Null

# 9. Change Status
$statusBody = @{ status = "inactive" } | ConvertTo-Json
Test-Endpoint "PATCH /api/users/:id/status" "PATCH" "http://localhost:5000/api/users/$dbId/status" $adminToken $statusBody 200 | Out-Null

# 10. Duplicate phone
$dupBody = @{ userId = "U-DUP-01"; name = "Dup"; phone = $newUserPhone; password = "pass"; role = "villager" } | ConvertTo-Json
Test-Endpoint "POST /api/users (Duplicate Phone)" "POST" "http://localhost:5000/api/users" $adminToken $dupBody 400 | Out-Null

# 11. Health
$health = Invoke-RestMethod -Uri http://localhost:5000/api/health
Write-Host "`nHealth Check:" $health.message

