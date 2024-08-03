const env = require('#configs/environments');
const axios = require('axios');

class RequestManager {
  constructor(baseURL, headers = {}, timeout = env.configuration.timeout) {
    if (!RequestManager.instance) {
      this.axios = axios.create({
        baseURL,
        headers,
        timeout,
      });
      RequestManager.instance = this;
    }
    return RequestManager.instance;
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

module.exports = RequestManager;
