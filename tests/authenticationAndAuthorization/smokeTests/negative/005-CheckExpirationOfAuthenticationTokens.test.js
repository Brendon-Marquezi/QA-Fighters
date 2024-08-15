const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');

describe('Authentication and Authorization', () => {
  let requestManager;

  beforeEach(() => {
    logger.info('Starting basic authentication test');
    requestManager = new RequestManager(env.environment.base_url2);
  });

  test('Check expiration of authentication token', async () => {
    const response = await requestManager.send(
      'get',
      '',
      {},
      { Authorization: `Bearer ${env.environment.invalid_access_token}` },
    );

    expect(response.status).toBe(401);
    expect(response.data.code).toBe(401);
    expect(response.data.message).toBe('Unauthorized');
    logger.info('Basic authentication test completed');
  });
});
