const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');

let requestManager;

beforeEach(() => {
  logger.info('Starting the test setup');
  requestManager = RequestManager.getInstance(env.environment.base_url);

  
});

test('Check if it is possible to list the available project types', async () => {
  logger.info('Starting to list the available project types');

  const response = await requestManager.send(
    'get',
    'project/type',
    {},
    { Authorization: global.basicAuth },
  );

  logger.info('Received response for project types');

  expect(response.status).toBe(200);
  expect(Array.isArray(response.data)).toBe(true);
  expect(response.data.length).toBeGreaterThan(0);
});
