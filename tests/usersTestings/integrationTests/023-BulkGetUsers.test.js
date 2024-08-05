const env = require('#configs/environments');
const requestManager = require('#utils/requestManager');

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`
  ).toString('base64');

test('Bulk get users from Jira', async () => {
  const accountId = '6245b0bbf6a26900695d38d9'; // Id do usuário
  const endpoint = `user/bulk?accountId=${accountId}`;

  const response = await requestManager.send(
    'get',
    endpoint,
    {}, 
    { Authorization: basicAuth, Accept: 'application/json' } 
  );

  
  expect(response.status).toBe(200);

 
  expect(response.data).toHaveProperty('values');
  expect(Array.isArray(response.data.values)).toBe(true);

  if (response.data.values.length > 0) {
    
    const firstUser = response.data.values[0];
    expect(firstUser).toHaveProperty('accountId');
    expect(firstUser).toHaveProperty('displayName');
    expect(firstUser).toHaveProperty('avatarUrls');
  }
});
