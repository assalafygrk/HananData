const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env' });
const Provider = require('../models/Provider');
const PricingConfig = require('../models/PricingConfig');
const axios = require('axios');

async function syncPricing() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const vtuProvider = await Provider.findOne({ type: 'vtu', status: 'active' });
    if (!vtuProvider) {
      console.log('❌ No active VTU provider found. Please add one in Admin Panel > Aggregators.');
      process.exit(1);
    }
    console.log(`✅ Using VTU Provider: ${vtuProvider.name}`);

    // ─── 1. DATA PLANS ─────────────────────────────────────────────────────────
    try {
      console.log('\n📦 Syncing Data Plans...');
      const dataRes = await axios.get('https://subandgain.com/api/databundles.php');
      const dataNetworks = dataRes.data; // Array of { NETWORK, BUNDLE }
      let dataCount = 0;

      for (const net of dataNetworks) {
        const network = net.NETWORK; // MTN, GLO, AIRTEL, 9MOBILE
        for (const bundle of net.BUNDLE) {
          // SKIP inactive plans
          if (bundle.status !== 'Active') continue;

          const apiCost = parseFloat(bundle.price[0].api_user);
          if (isNaN(apiCost)) continue;

          const userPrice = Math.ceil(apiCost * 1.05); // +5%
          const vendorPrice = Math.ceil(apiCost * 1.02); // +2%
          const planType = (bundle.type || 'GENERAL').toUpperCase().trim();

          await PricingConfig.findOneAndUpdate(
            { category: 'data', network, planId: bundle.dataPlan },
            {
              planName: `${bundle.dataBundle} ${bundle.duration}`.trim(),
              planType,
              duration: bundle.duration,
              apiCost,
              vendorPrice,
              userPrice,
              providerId: vtuProvider._id
            },
            { upsert: true, returnDocument: 'after' }
          );
          dataCount++;
        }
      }
      console.log(`   ✅ ${dataCount} active data plans synced`);
    } catch (e) {
      console.log('   ❌ Error syncing data plans:', e.message);
    }

    // ─── 2. CABLE TV PLANS ─────────────────────────────────────────────────────
    try {
      console.log('\n📺 Syncing Cable TV Plans...');
      const cableRes = await axios.get('https://subandgain.com/api/cablebundles.php');
      const cableServices = cableRes.data; // Array of { SERVICE, BUNDLE }
      let cableCount = 0;

      if (Array.isArray(cableServices)) {
        for (const srv of cableServices) {
          const network = srv.SERVICE; // STARTIMES, DSTV, GOTV
          for (const bundle of srv.BUNDLE) {
            if (bundle.status && bundle.status !== 'Active') continue;

            const apiCost = parseFloat(bundle.price);
            if (isNaN(apiCost)) continue;

            const userPrice = Math.ceil(apiCost * 1.05); // +5%
            const vendorPrice = Math.ceil(apiCost * 1.02); // +2%

            await PricingConfig.findOneAndUpdate(
              { category: 'cable', network, planId: bundle.billsCode },
              {
                planName: bundle.package,
                planType: 'CABLE',
                apiCost,
                vendorPrice,
                userPrice,
                providerId: vtuProvider._id
              },
              { upsert: true, returnDocument: 'after' }
            );
            cableCount++;
          }
        }
      }
      console.log(`   ✅ ${cableCount} cable TV plans synced`);
    } catch (e) {
      console.log('   ❌ Error syncing cable TV plans:', e.message);
    }

    // ─── 3. AIRTIME ─────────────────────────────────────────────────────────────
    console.log('\n📱 Configuring Airtime (1% discount)...');
    const airtimeNetworks = ['MTN', 'GLO', 'AIRTEL', '9MOBILE'];
    for (const network of airtimeNetworks) {
      // vendorPrice/userPrice stored as multiplier (0.99 = 99% of face value)
      await PricingConfig.findOneAndUpdate(
        { category: 'airtime', network },
        {
          planName: 'Airtime',
          planType: 'AIRTIME',
          planId: 'airtime',
          duration: 'Instant',
          apiCost: 1.00,    // 100% cost
          vendorPrice: 0.99, // user pays 99%
          userPrice: 0.99,   // user pays 99%
          providerId: vtuProvider._id
        },
        { upsert: true, returnDocument: 'after' }
      );
    }
    console.log(`   ✅ Airtime configured for: ${airtimeNetworks.join(', ')}`);

    // ─── 4. ELECTRICITY ──────────────────────────────────────────────────────────
    console.log('\n⚡ Configuring Electricity (₦50 flat fee)...');
    const electricityProviders = [
      'AEDC', 'IBEDC', 'EKEDC', 'IKEDC', 'PHEDC',
      'KEDCO', 'JEDC', 'EEDC', 'KAEDCO', 'BEDC'
    ];
    for (const network of electricityProviders) {
      await PricingConfig.findOneAndUpdate(
        { category: 'electricity', network },
        {
          planName: 'Electricity',
          planType: 'ELECTRICITY',
          planId: 'electricity',
          duration: 'Instant',
          apiCost: 0,       // pass-through, no % markup
          vendorPrice: 50,  // ₦50 flat fee
          userPrice: 50,    // ₦50 flat fee
          providerId: vtuProvider._id
        },
        { upsert: true, returnDocument: 'after' }
      );
    }
    console.log(`   ✅ Electricity configured for: ${electricityProviders.join(', ')}`);

    console.log('\n🎉 All done! Run `node scripts/syncSubandgainPricing.js` anytime to refresh pricing.');
    process.exit(0);
  } catch (e) {
    console.error('❌ Fatal error:', e.message);
    process.exit(1);
  }
}

syncPricing();
