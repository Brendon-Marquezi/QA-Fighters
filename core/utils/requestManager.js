const env = require('../configs/environments');

const axios = require('axios');

class RequestManager {
  constructor(baseURL, headers = {}, timeout = env.configuration.timeout) {
    this.axios = axios.create({
      baseURL,
      headers,
      timeout,
    });
  }

  async send(method, endpoint, params, headers, data) {
    return await this.axios.request({
      method: method,
      url: endpoint,
      params: params,
      headers: headers,
      data: data,
    });
  }
}

module.exports = new RequestManager(env.environment.base_url);
