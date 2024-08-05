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
    { Authorization: basicAuth, Accept: 'application/json' } 
  );

 
  expect(response.status).toBe(200);
  
  
  expect(Array.isArray(response.data)).toBe(true);
  
  
  if (response.data.length > 0) {
    
    const firstUser = response.data[0];
    expect(firstUser).toHaveProperty('accountId');
    expect(firstUser).toHaveProperty('displayName');
    expect(firstUser).toHaveProperty('avatarUrls');
  }
});
