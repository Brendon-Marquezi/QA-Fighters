const env = require('#configs/environments');
const RequestManager = require('#utils/requestManager');

describe('Invalid Basic Auth', () => {
  let invalidBasicAuth;
  let requestManager;

  beforeEach(() => {
    invalidBasicAuth =
      'Basic ' +
      Buffer.from(
        `${env.environment.username}:${env.environment.invalid_api_token}`,
      ).toString('base64');

    requestManager = RequestManager.getInstance(env.environment.base_url);
  });

  test('Verify basic authentication functionality', async () => {
    const response = await requestManager.send(
      'get',
      'events',
      {},
      { Authorization: invalidBasicAuth },
    );

    expect(response.status).toBe(401);
    expect(response.data).toBe(
      'Client must be authenticated to access this resource.',
    );
  });
});
