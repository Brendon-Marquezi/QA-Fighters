const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');

let requestManager;

beforeEach(() => {
  logger.info('Starting the test setup');
  requestManager = RequestManager.getInstance(env.environment.base_url);

  
});

test('Check if it is possible to list all visible projects', async () => {
  logger.info('Starting to list all visible projects');

  const response = await requestManager.send(
    'get',
    'project/search',
    {},
    { Authorization: global.basicAuth },
  );

  logger.info('Received response for visible projects');

  expect(response.status).toBe(200);
  expect(Array.isArray(response.data.values)).toBe(true);
  expect(response.data.values.length).toBeGreaterThan(0);
});
