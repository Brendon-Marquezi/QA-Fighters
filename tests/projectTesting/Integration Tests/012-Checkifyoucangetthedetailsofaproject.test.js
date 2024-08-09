const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');

let requestManager;

let projectKey = 'EX'; 

beforeEach(() => {
  logger.info('Starting the test setup');
  requestManager = RequestManager.getInstance(env.environment.base_url);

  
});

test('Check if you can get the details of a project', async () => {
  logger.info(`Starting to get details for project ${projectKey}`);

  const response = await requestManager.send(
    'get',
    `project/${projectKey}`,
    {},
    { Authorization: global.basicAuth },
  );

  logger.info(`Received response for project ${projectKey}`);

  expect(response.status).toBe(200);
  expect(response.data.key).toBe(projectKey);
  expect(response.data.name).toBe('Example');
});
