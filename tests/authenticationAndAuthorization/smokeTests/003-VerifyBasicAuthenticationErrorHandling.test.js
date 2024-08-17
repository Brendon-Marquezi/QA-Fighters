const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');

describe('Authentication and Authorization', () => {
  let invalidBasicAuth;
  let requestManager;

  beforeEach(() => {
    logger.info('Starting basic authentication error handler test');
    invalidBasicAuth =
      'Basic ' +
      Buffer.from(
        `${env.environment.username}:${env.environment.invalid_api_token}`,
      ).toString('base64');

    requestManager = RequestManager.getInstance(env.environment.base_url);
  });

  test('Verify basic authentication error handler', async () => {
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
    logger.info('Basic authentication error handler test completed');
  });
});
