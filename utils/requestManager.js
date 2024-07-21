require('dotenv').config();

const axios = require('axios');

class RequestManager {
    constructor(baseURL, headers={}, timeout=5000) {
        this.axios = axios.create({
            baseURL,
            headers,
            timeout
        })
    }

    async send(method, endpoint, params, headers, data){
        return this.axios.request({
            method: method,
            url: endpoint,
            params: params,
            headers: headers,
            data: data
        })
    }
};

module.exports = new RequestManager(process.env.JIRA_BASE_URL);