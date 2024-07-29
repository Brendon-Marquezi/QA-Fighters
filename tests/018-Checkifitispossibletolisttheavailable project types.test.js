const env = require('#configs/environments');
const RequestManager = require('#utils/requestManager');

const requestManager = new RequestManager(env.environment.base_url);

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`,
  ).toString('base64');

test('Check if it is possible to list the available project types', async () => {

  const response = await requestManager.send(
    'get',
    'project/type',
    {},
    { Authorization: basicAuth },
  );

  expect(response.status).toBe(200);
  expect(Array.isArray(response.data)).toBe(true);
  expect(response.data.length).toBeGreaterThan(0);
});
