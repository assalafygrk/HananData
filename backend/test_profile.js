const axios = require('axios');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

async function test() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hanandata');
  const user = await User.findOne({});
  console.log("User found in DB:", user.name, "walletBalance:", user.walletBalance);
  
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret_key_123', { expiresIn: '30d' });
  
  try {
    const res = await axios.get('http://127.0.0.1:5000/api/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Profile API Response:", res.data);
  } catch (err) {
    console.error("Profile API Error:", err.response ? err.response.data : err.message);
  }
  process.exit();
}

test();
