const env = require('#configs/environments');
const requestManager = require('#utils/requestManager');

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`
  ).toString('base64');

test('Get all users from Jira', async () => {
  const endpoint = 'users/search'; 

  const response = await requestManager.send(
    'get',
    endpoint,
    {}, 
    { Authorization: basicAuth, Accept: 'application/json' } // Headers
  );

  // Verifique se o status da resposta é 200
  expect(response.status).toBe(200);
  
  
  expect(Array.isArray(response.data)).toBe(true);
  
  
  if (response.data.length > 0) {
    // Verifique se o primeiro item tem o formato esperado
    const firstUser = response.data[0];
    expect(firstUser).toHaveProperty('accountId');
    expect(firstUser).toHaveProperty('displayName');
    expect(firstUser).toHaveProperty('avatarUrls');
  }
});
