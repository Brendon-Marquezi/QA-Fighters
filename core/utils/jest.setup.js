const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);

beforeAll(async () => {
  global.basicAuth =
    'Basic ' +
    Buffer.from(
      `${env.environment.username}:${env.environment.api_token}`
    ).toString('base64');
    logger.info('Starting authentication for testing')
});

afterAll(async () => {
  global.basicAuth = null;
  logger.info('Cleaning the system after testing')
});
