const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');

describe('Authentication and Authorization', () => {
  let requestManager;

  beforeEach(() => {
    logger.info('Starting OAuth 2.0 error handler test');
    const oauthUrl = env.environment.auth_url;
    if (oauthUrl) {
      requestManager = new RequestManager(oauthUrl);
    } else {
      logger.error('Auth_url was not set');
    }
  });

  test('Verify OAuth 2.0 error handler', async () => {
    logger.info('Starting OAuth 2.0 test with invalid code');
    const response = await requestManager.send(
      'post',
      '',
      {},
      {},
      {
        grant_type: 'authorization_code',
        client_id: `${env.environment.client_id_auth}`,
        client_secret: `${env.environment.client_secret}`,
        code: `${env.environment.invalid_code}`,
        redirect_uri: 'https://google.com',
      },
    );

    logger.info('Validating API response');
    expect(response.status).toBe(400);
    expect(response.data.error_description).toBe(
      'authorization_code is invalid',
    );
    logger.info('OAuth 2.0 error handler test completed');
  });
});
