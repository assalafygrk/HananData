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
      const authHeader = this.apiSecret.toLowerCase().startsWith('bearer ') 
        ? this.apiSecret 
        : `Bearer ${this.apiSecret}`;

      const headers = {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'api-key': this.apiKey
      };

      const response = await axios.post(url, data, { headers });
      
      // PaymentPoint API returns 200 OK with { status: "success", bankAccounts: [...] }
      if (response.data && response.data.status === 'success') {
        return {
          status: true,
          data: response.data
        };
      }
      
      return {
        status: false,
        error: 'ERR_PAYMENTPOINT',
        description: response.data?.message || 'Unknown error from PaymentPoint'
      };
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
