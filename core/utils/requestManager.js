const env = require('#configs/environments');
const axios = require('axios');

class RequestManager {
  constructor(baseURL, headers = {}, timeout = env.configuration.timeout) {
    if (
      RequestManager.instance &&
      baseURL === RequestManager.instance.baseURL
    ) {
      return RequestManager.instance;
    }

    this.axios = axios.create({
      baseURL,
      headers,
      timeout,
    });

    RequestManager.instance = this;
    this.baseURL = baseURL;
  }

  async send(method, endpoint, params, headers, data) {
    try {
      const response = await this.axios.request({
        method: method,
        url: endpoint,
        params: params,
        headers: headers,
        data: data,
      });
      return response;
    } catch (error) {
      return error.response || error;
    }
  }

  static getInstance(
    baseURL,
    headers = {},
    timeout = env.configuration.timeout,
  ) {
    if (
      !RequestManager.instance ||
      baseURL !== RequestManager.instance.baseURL
    ) {
      RequestManager.instance = new RequestManager(baseURL, headers, timeout);
    }
    return RequestManager.instance;
  }
}

module.exports = RequestManager;
