const axios = require('axios');

class SubandgainClient {
  constructor(username, apiKey) {
    this.username = username;
    this.apiKey = apiKey;
    this.baseUrl = 'https://subandgain.com/api';
  }

  _buildUrl(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}/${endpoint}`);
    url.searchParams.append('username', this.username);
    url.searchParams.append('apiKey', this.apiKey);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.append(key, value);
      }
    }
    return url.toString();
  }

  async checkBalance() {
    try {
      const url = this._buildUrl('balance.php');
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Subandgain Balance Check Error:', error.message);
      return { error: 'ERR_NETWORK', description: error.message };
    }
  }

  async purchaseAirtime({ network, phoneNumber, amount }) {
    try {
      // network should be MTN, GLO, AIRTEL, 9MOBILE
      const url = this._buildUrl('airtime.php', { network, phoneNumber, amount });
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Subandgain Airtime Error:', error.message);
      return { error: 'ERR_NETWORK', description: error.message };
    }
  }

  async purchaseData({ network, dataPlan, phoneNumber }) {
    try {
      const url = this._buildUrl('data.php', { network, dataPlan, phoneNumber });
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Subandgain Data Error:', error.message);
      return { error: 'ERR_NETWORK', description: error.message };
    }
  }

  _mapCableService(service) {
    if (!service) return '';
    return service.toUpperCase();
  }

  async verifyCable({ service, smartNumber }) {
    try {
      const mappedService = this._mapCableService(service);
      const url = this._buildUrl('verify_bills.php', { service: mappedService, smartNumber });
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Subandgain Verify Cable Error:', error.message);
      return { error: 'ERR_NETWORK', description: error.message };
    }
  }

  async purchaseCable({ service, bills_code, smartNumber }) {
    try {
      const mappedService = this._mapCableService(service);
      const url = this._buildUrl('bills.php', { service: mappedService, bills_code, smartNumber });
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Subandgain Cable Error:', error.message);
      return { error: 'ERR_NETWORK', description: error.message };
    }
  }

  _mapElectricityService(service) {
    const map = {
      'KEDCO': 'KEDC',
      'KAEDCO': 'KAEDC',
      'JED': 'JEDC',
      'PHED': 'PhED',
      'PHEDC': 'PhED'
    };
    return map[service.toUpperCase()] || service;
  }

  async verifyElectricity({ service, meterNumber, meterType }) {
    try {
      const mappedService = this._mapElectricityService(service);
      const url = this._buildUrl('verify_electricity.php', { service: mappedService, meterNumber, meterType });
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Subandgain Verify Electricity Error:', error.message);
      return { error: 'ERR_NETWORK', description: error.message };
    }
  }

  async purchaseElectricity({ service, meterNumber, meterType, accessToken, amount }) {
    try {
      const mappedService = this._mapElectricityService(service);
      const url = this._buildUrl('electricity.php', { service: mappedService, meterNumber, meterType, accessToken, amount });
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Subandgain Electricity Error:', error.message);
      return { error: 'ERR_NETWORK', description: error.message };
    }
  }
}

module.exports = SubandgainClient;
