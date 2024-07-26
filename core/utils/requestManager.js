require("dotenv").config();
const axios = require("axios");


class RequestManager {
 constructor(baseURL, headers = {}, timeout = 5000) {
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
   return this.axios.request({
     method: method,
     url: endpoint,
     params: params,
     headers: headers,
     data: data,
   });
 }
}


const instance = new RequestManager(process.env.JIRA_BASE_URL);
Object.freeze(instance); 


module.exports = instance;
