const env = require('#configs/environments');
const requestManager = require('#utils/requestManager');

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`
  ).toString('base64');

test('Get user default columns from Jira', async () => {
  const accountId = '6245b0bbf6a26900695d38d9'; // ID
  const endpoint = `user/columns${accountId ? `?accountId=${accountId}` : ''}`;

  const response = await requestManager.send(
    'get',
    endpoint,
    {}, 
    { Authorization: basicAuth, Accept: 'application/json' } 
  );


  expect(response.status).toBe(200);

  
  expect(response.data).toBeInstanceOf(Array);

  if (response.data.length > 0) {
    
    const firstColumn = response.data[0];
    expect(firstColumn).toHaveProperty('label');
    expect(firstColumn).toHaveProperty('value');
  }
});
