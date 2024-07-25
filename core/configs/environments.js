const environments = require('./env.json');
const configuration = require('./config.json');

const environment = environments[configuration.environment];

module.exports = { environment, configuration };
