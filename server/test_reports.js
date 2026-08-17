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

  console.log('--- Authorization Tests ---');
  console.log('No token:', (await makeReq('GET', '/api/reports/summary', null, null)).status);
  console.log('Op token:', (await makeReq('GET', '/api/reports/summary', null, opToken)).status);
  
  console.log('\n--- Endpoints Tests (Admin) ---');
  const summary = await makeReq('GET', '/api/reports/summary', null, adminToken);
  console.log('Summary status:', summary.status);
  console.log('Users available:', summary.data.data.users.available);
  console.log('Pumps available:', summary.data.data.pumps.available);
  
  const users = await makeReq('GET', '/api/reports/users?role=villager', null, adminToken);
  console.log('Users report status:', users.status, 'Total villager records:', users.data.pagination.total);
  
  // Verify sensitive data masked
  const rawUsers = JSON.stringify(users.data.data);
  console.log('Contains password hash?', rawUsers.includes('$2a$10$'));
  
  const villages = await makeReq('GET', '/api/reports/villages', null, adminToken);
  console.log('Villages report status:', villages.status, 'Total records:', villages.data.pagination.total);

  const activity = await makeReq('GET', '/api/reports/activity', null, adminToken);
  console.log('Activity report status:', activity.status, 'Total records:', activity.data.pagination.total);

  console.log('\n--- Regression Tests ---');
  console.log('Analytics status:', (await makeReq('GET', '/api/analytics/dashboard', null, adminToken)).status);
  console.log('Health status:', (await makeReq('GET', '/api/health', null, null)).status);
}

run();
