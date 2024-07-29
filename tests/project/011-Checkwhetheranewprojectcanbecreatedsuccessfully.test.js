const env = require('#configs/environments');
const RequestManager = require('#utils/requestManager');

const requestManager = new RequestManager(env.environment.base_url);

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`,
  ).toString('base64');

let createdProjectId;

beforeEach(async () => {
  const projectResponse = await requestManager.send(
    'post',
    'project',
    {},
    { Authorization: `${basicAuth}` },
    {                                               
      key: 'TESTE23',
      name: 'Example7',
      projectTemplateKey: 'com.pyxis.greenhopper.jira:gh-simplified-scrum-classic',
      leadAccountId: env.environment.leadAccountId,
    },
  );

  createdProjectId = projectResponse.data.id;
});

test('Check whether a new project can be created successfully', async () => {
  const projectResponse = await requestManager.send(
    'post',
    'project',
    {},
    { Authorization: `${basicAuth}` },
    {
      key: 'TESTE23',
      name: 'Example7',
      projectTemplateKey: 'com.pyxis.greenhopper.jira:gh-simplified-scrum-classic',
      leadAccountId: env.environment.leadAccountId,
    },
  );

  expect(projectResponse.status).toBe(201);
  expect(projectResponse.data.key).toBe('TESTE23');
});
