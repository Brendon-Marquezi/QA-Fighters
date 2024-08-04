const env = require('#configs/environments');
const RequestManager = require('#utils/requestManager');

const requestManager = new RequestManager(env.environment.base_url);

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`,
  ).toString('base64');

test('Check whether a new project can be created successfully', async () => {
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

  expect(projectResponse.status).toBe(201);
  expect(projectResponse.data.key).toBe('TESTE02');
});
