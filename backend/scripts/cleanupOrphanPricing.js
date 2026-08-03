const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env' });
const PricingConfig = require('../models/PricingConfig');
const Provider = require('../models/Provider');

async function cleanupOrphans() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const pricingConfigs = await PricingConfig.find();
    let deletedCount = 0;

    for (const config of pricingConfigs) {
      if (config.providerId) {
        const provider = await Provider.findById(config.providerId);
        if (!provider) {
          console.log(`Orphan found: PricingConfig ${config._id} points to non-existent provider ${config.providerId}`);
          await PricingConfig.findByIdAndDelete(config._id);
          deletedCount++;
        }
      } else {
        // If providerId is missing completely? Maybe delete?
        // Let's only delete if it points to an invalid provider.
      }
    }

    console.log(`Cleanup complete. Deleted ${deletedCount} orphan PricingConfigs.`);
    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

cleanupOrphans();
