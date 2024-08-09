const env = require('#configs/environments');
const RequestManager = require('#utils/requestManager');

let requestManager;

test('Get all users from Jira', async () => {
  requestManager = RequestManager.getInstance(env.environment.base_url);
  const endpoint = 'users/search'; 
  


  const response = await requestManager.send(
    'get',
    endpoint,
    {}, 
    { Authorization: global.basicAuth, Accept: 'application/json' } 
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
