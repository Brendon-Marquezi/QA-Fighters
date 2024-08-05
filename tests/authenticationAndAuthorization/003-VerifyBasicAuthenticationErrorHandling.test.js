const env = require('#configs/environments');
const RequestManager = require('#utils/requestManager');

const requestManager = new RequestManager(env.environment.base_url);

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.invalid_api_token}`,
  ).toString('base64');

test('Verify basic authentication functionality', async () => {
  let response = await requestManager.send(
    'get',
    'project',
    {},
    { Authorization: `${basicAuth}` },
  );

  expect(response.status).toBe(400);
  expect(response.data).toBe('you do not have permission');
});
