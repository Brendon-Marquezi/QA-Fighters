const env = require('#configs/environments');
const RequestManager = require('#utils/requestManager');

const requestManager = new RequestManager(env.environment.base_url);

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`,
  ).toString('base64');

test('Check if you can get the details of a project', async () => {
  const projectKey = 'EX'; // Chave do projeto que você deseja obter os detalhes

  const response = await requestManager.send(
    'get',
    `project/${projectKey}`,
    {},
    { Authorization: basicAuth },
  );

  expect(response.status).toBe(200);
  expect(response.data.key).toBe(projectKey);
  expect(response.data.name).toBe('Example');
});
