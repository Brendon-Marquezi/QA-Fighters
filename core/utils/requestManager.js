const env = require('#configs/environments');

const axios = require('axios');

class RequestManager {
  constructor(baseURL, headers = {}, timeout = env.configuration.timeout) {
    if (RequestManager.instance) {
      return RequestManager.instance;
    }

    this.axios = axios.create({
      baseURL,
      headers,
      timeout,
    });

    RequestManager.instance = this;
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

const instance = new RequestManager(env.environment.base_url);
Object.freeze(instance);

module.exports = instance;
