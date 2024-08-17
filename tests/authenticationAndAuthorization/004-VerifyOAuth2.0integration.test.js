const env = require('#configs/environments');
const RequestManager = require('#utils/requestManager');

const requestManager = new RequestManager(env.environment.auth_url);

describe.skip('Authentication and Authorization', () => {
  test('Verify OAuth2 authentication functionality', async () => {
    let response = await requestManager.send(
      'post',
      '',
      {},
      {},
      {
        grant_type: 'authorization_code',
        client_id: `${env.environment.client_id_auth}`,
        client_secret: `${env.environment.client_secret}`,
        code: `${env.environment.code}`,
        redirect_uri: 'https://google.com',
      },
    );

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('access_token');
  });
});
