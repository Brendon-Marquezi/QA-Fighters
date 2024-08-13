const env = require('#configs/environments');
const RequestManager = require('#utils/requestManager');

describe('Basic Auth', () => {
  beforeEach(() => {
    basicAuth =
      'Basic ' +
      Buffer.from(
        `${env.environment.username}:${env.environment.api_token}`,
      ).toString('base64');

    requestManager = RequestManager.getInstance(env.environment.base_url);
  });

  test('Verify basic authentication functionality', async () => {
    const response = await requestManager.send(
      'get',
      'events',
      {},
      { Authorization: `${basicAuth}` },
    );

    expect(response.status).toBe(200);
    expect(response.data[0]).toHaveProperty('name');
  });
});
