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
    } catch {
        $status = $_.Exception.Response.StatusCode.value__
        if ($status -eq $expectedStatus) {
            Write-Host "SUCCESS: Got expected status $status" -ForegroundColor Green
        } else {
            Write-Host "FAIL: Expected $expectedStatus but got $status" -ForegroundColor Red
        }
        return
    }

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
Test-Endpoint "GET /api/villages (No Token)" "GET" "http://localhost:5000/api/villages" "" "" 401

# 2. Operator token -> 403
Test-Endpoint "GET /api/villages (Operator)" "GET" "http://localhost:5000/api/villages" $opToken "" 403

# 3. Villager token -> 403
Test-Endpoint "GET /api/villages (Villager)" "GET" "http://localhost:5000/api/villages" $vilToken "" 403

# 4. Admin token -> 200
$villagesRes = Test-Endpoint "GET /api/villages (Admin)" "GET" "http://localhost:5000/api/villages" $adminToken "" 200
Write-Host "Total villages:" $villagesRes.pagination.total

# 5. Filter tests
Test-Endpoint "GET /api/villages?search=Sonapur (Search)" "GET" "http://localhost:5000/api/villages?search=Sonapur" $adminToken "" 200 | Out-Null
Test-Endpoint "GET /api/villages?district=Kamrup (District)" "GET" "http://localhost:5000/api/villages?district=Kamrup" $adminToken "" 200 | Out-Null

# 6. Duplicate Village ID
$newVilId = "V-TEST-" + (Get-Random -Maximum 9999)
$createBody = @{ villageId = $newVilId; name = "Test Village"; district = "Test District"; block = "Test Block"; households = 100; status = "active" } | ConvertTo-Json
$created = Test-Endpoint "POST /api/villages (Valid)" "POST" "http://localhost:5000/api/villages" $adminToken $createBody 201
$dbId = $created.data._id
Write-Host "Created Village ID:" $dbId

Test-Endpoint "POST /api/villages (Duplicate villageId)" "POST" "http://localhost:5000/api/villages" $adminToken $createBody 400 | Out-Null

# 7. Get Village by ID
Test-Endpoint "GET /api/villages/:id" "GET" "http://localhost:5000/api/villages/$dbId" $adminToken "" 200 | Out-Null

# 8. Update Village
$updateBody = @{ name = "Updated Test Village" } | ConvertTo-Json
Test-Endpoint "PUT /api/villages/:id" "PUT" "http://localhost:5000/api/villages/$dbId" $adminToken $updateBody 200 | Out-Null

# 9. Change Status
$statusBody = @{ status = "inactive" } | ConvertTo-Json
Test-Endpoint "PATCH /api/villages/:id/status (Valid)" "PATCH" "http://localhost:5000/api/villages/$dbId/status" $adminToken $statusBody 200 | Out-Null

$statusBodyInv = @{ status = "destroyed" } | ConvertTo-Json
Test-Endpoint "PATCH /api/villages/:id/status (Invalid Status)" "PATCH" "http://localhost:5000/api/villages/$dbId/status" $adminToken $statusBodyInv 400 | Out-Null

# Regression
Write-Host "`n=== Regression Tests ==="
$health = Invoke-RestMethod -Uri http://localhost:5000/api/health
Write-Host "Health Check:" $health.message

$usersRes = Test-Endpoint "GET /api/users (Admin)" "GET" "http://localhost:5000/api/users" $adminToken "" 200
Write-Host "Users API working, total users:" $usersRes.pagination.total
