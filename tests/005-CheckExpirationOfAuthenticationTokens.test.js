const env = require('#configs/environments');
const RequestManager = require('#utils/requestManager');

const requestManager = new RequestManager(env.environment.base2_url);

test('Check expiration of authentication token', async () => {
  let response = await requestManager.send(
    'get',
    '',
    {},
    { Authorization: `Bearer ${env.environment.invalid_access_token}` },
  );

  expect(response.status).toBe(400);
});
