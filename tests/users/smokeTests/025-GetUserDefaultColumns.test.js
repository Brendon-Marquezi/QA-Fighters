const env = require('#configs/environments');
const RequestManager = require('#utils/requestManager');

let requestManager;

test('Get user default columns from Jira', async () => {
  const accountId = '6245b0bbf6a26900695d38d9'; // ID
  const endpoint = `user/columns${accountId ? `?accountId=${accountId}` : ''}`;
  requestManager = RequestManager.getInstance(env.environment.base_url);


  const response = await requestManager.send(
    'get',
    endpoint,
    {}, 
    { Authorization: global.basicAuth, Accept: 'application/json' } 
  );


  expect(response.status).toBe(200);

  
  expect(response.data).toBeInstanceOf(Array);

  if (response.data.length > 0) {
    
    const firstColumn = response.data[0];
    expect(firstColumn).toHaveProperty('label');
    expect(firstColumn).toHaveProperty('value');
  }
});
