const axios = require('axios');

async function check() {
  try {
    const res = await axios.get('http://localhost:8080/api/v1/products/all');
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error(err.message);
  }
}
check();
