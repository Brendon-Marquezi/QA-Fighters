const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');

const requestManager = new RequestManager(env.environment.base_url);

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`,
  ).toString('base64');

beforeEach(() => {
  logger.info('Starting the test setup');
  // Adicionar qualquer setup necessário antes de cada teste
});

test('Check whether a new project can be created successfully', async () => {
  logger.info('Starting to create a new project');

  const projectResponse = await requestManager.send(
    'post',
    'project',
    {},
    { Authorization: `${basicAuth}` },
    {
      key: 'TESTE025',
      name: 'Example09',
      projectTemplateKey:
        'com.pyxis.greenhopper.jira:gh-simplified-scrum-classic',
      leadAccountId: env.environment.leadAccountId,
    },
  );

  logger.info('Received response for project creation');

  expect(projectResponse.status).toBe(201);
  expect(projectResponse.data.key).toBe('TESTE02');
});
