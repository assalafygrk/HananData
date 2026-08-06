const axios = require('axios');

class PaymentPointClient {
  constructor(apiKey, apiSecret, businessId) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.businessId = businessId;
    this.baseUrl = 'https://api.paymentpoint.co/api/v1';
  }

  async createVirtualAccount({ email, name, phoneNumber }) {
    try {
      const url = `${this.baseUrl}/createVirtualAccount`;
      const data = {
        email,
        name,
        phoneNumber,
        bankCode: ['20946'],
        businessId: this.businessId
      };
      const headers = {
        'Authorization': `Bearer ${this.apiSecret}`,
        'Content-Type': 'application/json',
        'api-key': this.apiKey
      };

      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      console.error('PaymentPoint createVirtualAccount Error:', error.response ? error.response.data : error.message);
      return {
        status: false,
        error: 'ERR_PAYMENTPOINT',
        description: error.response?.data?.message || error.message
      };
    }
  }
}

module.exports = PaymentPointClient;
