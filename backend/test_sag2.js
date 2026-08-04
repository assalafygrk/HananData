const axios = require('axios');
const Provider = require('./models/Provider');
const mongoose = require('mongoose');
require('dotenv').config();

async function test() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hanandata');
  const vtuProvider = await Provider.findOne({ type: 'vtu', status: 'active' });
  
  const url = new URL(`https://subandgain.com/api/verify_electricity.php`);
  url.searchParams.append('username', vtuProvider.username);
  url.searchParams.append('apiKey', vtuProvider.apiKeyEncrypted);
  url.searchParams.append('meterNumber', '01011234567');
  url.searchParams.append('meterType', 'PRE');
  
  for (const s of ['KEDCO', 'KEDC', 'KAEDCO', 'KAEDC', 'JED', 'JEDC', 'PHED', 'PhED']) {
    url.searchParams.set('service', s);
    try {
      const res = await axios.get(url.toString());
      console.log(`${s}:`, res.data);
    } catch (err) {
      console.error(`${s} ERROR:`, err.message);
    }
  }

  process.exit();
}

test();
