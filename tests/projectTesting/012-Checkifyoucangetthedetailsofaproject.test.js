const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');

const requestManager = new RequestManager(env.environment.base_url);

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`,
  ).toString('base64');

let projectKey = 'EX'; 

beforeEach(() => {
  logger.info('Starting the test setup');
  
});

test('Check if you can get the details of a project', async () => {
  logger.info(`Starting to get details for project ${projectKey}`);

  const response = await requestManager.send(
    'get',
    `project/${projectKey}`,
    {},
    { Authorization: `${basicAuth}` },
  );

  logger.info(`Received response for project ${projectKey}`);

  expect(response.status).toBe(200);
  expect(response.data.key).toBe(projectKey);
  expect(response.data.name).toBe('Example');
});
