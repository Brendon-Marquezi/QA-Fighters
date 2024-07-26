const env = require('../core/configs/environments');

const requestManager = require('../core/utils/requestManager');

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`,
  ).toString('base64');

test('Verify basic authentication functionality', async () => {
  let response = await requestManager.send(
    'get',
    'project',
    {},
    { Authorization: `${basicAuth}` },
    {},
  );

  expect(response.status).toBe(200);
});
