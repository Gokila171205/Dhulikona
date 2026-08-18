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

  console.log('No token:', (await makeReq('GET', '/api/analytics/dashboard', null, null)).status);
  console.log('Op token:', (await makeReq('GET', '/api/analytics/dashboard', null, opToken)).status);
  
  const analytics = await makeReq('GET', '/api/analytics/dashboard', null, adminToken);
  console.log('Admin GET Analytics status:', analytics.status);
  console.log('Data payload preview:');
  console.log(JSON.stringify(analytics.data.data, null, 2));

  console.log('\nRegression checks:');
  console.log('Health check:', (await makeReq('GET', '/api/health', null, null)).status);
  console.log('Users check:', (await makeReq('GET', '/api/users', null, adminToken)).status);
  console.log('Villages check:', (await makeReq('GET', '/api/villages', null, adminToken)).status);
  console.log('Audit logs check:', (await makeReq('GET', '/api/audit-logs', null, adminToken)).status);
}

run();
