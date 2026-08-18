const http = require('http');

function makeReq(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (token) options.headers['Authorization'] = 'Bearer ' + token;
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try {
           resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch(e) {
           resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  const adminAuth = await makeReq('POST', '/api/auth/login', {phone: '9999999999', password: '123456'});
  const opAuth = await makeReq('POST', '/api/auth/login', {phone: '9876543210', password: '123456'});
  
  const adminToken = adminAuth.data.data.token;
  const opToken = opAuth.data.data.token;

  console.log('No token (Audit):', (await makeReq('GET', '/api/audit-logs', null, null)).status);
  console.log('Op token (Audit):', (await makeReq('GET', '/api/audit-logs', null, opToken)).status);
  
  const logs = await makeReq('GET', '/api/audit-logs', null, adminToken);
  console.log('Admin GET Logs status:', logs.status, 'Total before actions:', logs.data.pagination.total);
  
  // 1. Create a user
  const createdUser = await makeReq('POST', '/api/users', {
    userId: 'U-AUDIT-' + Date.now(), name: 'Audit User', phone: Date.now().toString().slice(0, 10), password: 'pass', role: 'villager'
  }, adminToken);

  // 2. Update a user
  await makeReq('PUT', '/api/users/' + createdUser.data.data._id, { name: 'Audit User Updated' }, adminToken);

  // 3. Create a village
  const createdVil = await makeReq('POST', '/api/villages', {
    villageId: 'V-AUDIT-' + Date.now(), name: 'Audit Vil', district: 'D', block: 'B'
  }, adminToken);
  
  // 4. Update village status
  await makeReq('PATCH', '/api/villages/' + createdVil.data.data._id + '/status', { status: 'inactive' }, adminToken);

  // 5. Fetch logs again
  const newLogs = await makeReq('GET', '/api/audit-logs', null, adminToken);
  console.log('Admin GET Logs status after actions:', newLogs.status, 'Total now:', newLogs.data.pagination.total);
  
  console.log('Recent 4 logs actions:', newLogs.data.data.slice(0, 4).map(l => l.action + ' - ' + l.module));
  
  // Check for passwords/tokens in the first 10 logs
  const rawData = JSON.stringify(newLogs.data);
  console.log('Contains password hash?', rawData.includes('$2a$10$') || rawData.includes('password'));
  console.log('Contains token?', rawData.includes('eyJhbGciOi'));
  
  // Filter check
  const filterLogs = await makeReq('GET', '/api/audit-logs?module=USERS&action=CREATE', null, adminToken);
  console.log('Filter logs status:', filterLogs.status, 'Results:', filterLogs.data.pagination.total);

  // Mutability check (PUT shouldn't exist)
  if (newLogs.data.data[0]) {
      const putLog = await makeReq('PUT', '/api/audit-logs/' + newLogs.data.data[0]._id, { action: 'EDITED' }, adminToken);
      console.log('PUT Audit Log status (expect 404):', putLog.status);
  }

  // Regression
  console.log('Health check:', (await makeReq('GET', '/api/health', null, null)).status);
}

run();
