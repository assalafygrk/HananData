const axios = require('axios');
const cron = require('node-cron');
const PricingConfig = require('../models/PricingConfig');
const Provider = require('../models/Provider');

const fetchAndSyncPrices = async () => {
  try {
    console.log('[Cron] Starting provider price sync...');
    const vtuProvider = await Provider.findOne({ type: 'vtu', status: 'active' });
    if (!vtuProvider) {
      console.log('[Cron] No active VTU provider found. Skipping price sync.');
      return;
    }

    // 1. Sync Data Bundles
    console.log('[Cron] Fetching data bundles...');
    const dataResponse = await axios.get('https://subandgain.com/api/databundles.php');
    if (dataResponse.data && Array.isArray(dataResponse.data)) {
      let updatedDataCount = 0;
      for (const networkGroup of dataResponse.data) {
        if (!networkGroup.BUNDLE) continue;
        for (const bundle of networkGroup.BUNDLE) {
          const planId = bundle.dataPlan;
          let newCost = null;
          
          if (bundle.price && bundle.price[0] && bundle.price[0].api_user) {
             newCost = parseFloat(bundle.price[0].api_user);
          } else if (bundle.price && bundle.price[0] && bundle.price[0].free_user) {
             newCost = parseFloat(bundle.price[0].free_user);
          }

          if (newCost) {
            const userPrice = Math.ceil(newCost * 1.05); // 5% markup
            const vendorPrice = Math.ceil(newCost * 1.03); // 3% markup

            const result = await PricingConfig.updateOne(
              { category: 'data', planId: planId, providerId: vtuProvider._id },
              { 
                $set: { 
                  apiCost: newCost, 
                  userPrice, 
                  vendorPrice 
                } 
              }
            );
            if (result.modifiedCount > 0) updatedDataCount++;
          }
        }
      }
      console.log(`[Cron] Updated ${updatedDataCount} data plans.`);
    }

    // 2. Sync Edu Pins
    console.log('[Cron] Fetching education pins...');
    const eduResponse = await axios.get('https://subandgain.com/api/edu_prices.php');
    if (eduResponse.data && Array.isArray(eduResponse.data)) {
      let updatedEduCount = 0;
      for (const serviceGroup of eduResponse.data) {
        if (!serviceGroup.BUNDLE) continue;
        for (const bundle of serviceGroup.BUNDLE) {
          const planId = bundle.eduCode;
          const newCost = parseFloat(bundle.price);

          if (!isNaN(newCost)) {
            const userPrice = Math.ceil(newCost * 1.05);
            const vendorPrice = Math.ceil(newCost * 1.03);

            // Using exam-pin as the category since that's what the controller queries
            const result = await PricingConfig.updateOne(
              { category: 'exam-pin', planId: planId, providerId: vtuProvider._id },
              { 
                $set: { 
                  apiCost: newCost, 
                  userPrice, 
                  vendorPrice 
                } 
              }
            );
            if (result.modifiedCount > 0) updatedEduCount++;
          }
        }
      }
      console.log(`[Cron] Updated ${updatedEduCount} education pins.`);
    }

    // 3. Sync Cable TV Plans
    console.log('[Cron] Fetching cable tv plans...');
    try {
      // Trying tv_prices.php or cable_prices.php based on common Subandgain endpoints
      // Fallback is usually required if the exact endpoint name varies
      const cableResponse = await axios.get('https://subandgain.com/api/tv_prices.php');
      if (cableResponse.data && Array.isArray(cableResponse.data)) {
        let updatedCableCount = 0;
        for (const providerGroup of cableResponse.data) {
          if (!providerGroup.BUNDLE) continue;
          for (const bundle of providerGroup.BUNDLE) {
            const planId = bundle.planCode || bundle.cableCode || bundle.plan_id; 
            const newCost = parseFloat(bundle.price);

            if (!isNaN(newCost) && planId) {
              const userPrice = Math.ceil(newCost * 1.05);
              const vendorPrice = Math.ceil(newCost * 1.03);

              const result = await PricingConfig.updateOne(
                { category: 'cable', planId: planId, providerId: vtuProvider._id },
                { 
                  $set: { 
                    apiCost: newCost, 
                    userPrice, 
                    vendorPrice 
                  } 
                }
              );
              if (result.modifiedCount > 0) updatedCableCount++;
            }
          }
        }
        console.log(`[Cron] Updated ${updatedCableCount} cable plans.`);
      }
    } catch (cableErr) {
      console.log(`[Cron] Cable TV sync skipped or failed (endpoint might not exist or timed out). Error: ${cableErr.message}`);
    }

    console.log('[Cron] Provider price sync completed successfully.');
  } catch (error) {
    console.error('[Cron] Error during price sync:', error.message);
  }
};

const initCronJob = () => {
  // Run every 4 hours
  cron.schedule('0 */4 * * *', () => {
    fetchAndSyncPrices();
  });
  console.log('[Cron] Provider price sync scheduled (every 4 hours).');
};

module.exports = { initCronJob, fetchAndSyncPrices };
