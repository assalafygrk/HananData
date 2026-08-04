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
  url.searchParams.append('service', 'IKEDC');
  url.searchParams.append('meterNumber', '01011234567');
  url.searchParams.append('meterType', 'PRE');
  
  try {
    const res = await axios.get(url.toString());
    console.log("IKEDC RESPONSE:", res.data);
  } catch (err) {
    console.error("IKEDC ERROR:", err.message);
  }

  url.searchParams.set('service', 'ikeja-electric');
  try {
    const res = await axios.get(url.toString());
    console.log("ikeja-electric RESPONSE:", res.data);
  } catch (err) {
    console.error("ikeja-electric ERROR:", err.message);
  }

  process.exit();
}

test();
