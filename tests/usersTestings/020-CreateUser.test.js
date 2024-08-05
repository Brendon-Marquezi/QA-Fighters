const requestManager = require('#utils/requestManager');
const env = require('#configs/environments');

const basicAuth = 
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`
  ).toString('base64');

test('Create a user in Jira', async () => {
  const endpoint = 'user'; 
  
  const bodyData = {
    emailAddress: 'coketa2284@biscoine.com', // Email
    products: [], // Produtos associados ao usuário
  };

  const response = await requestManager.send(
    'post',
    endpoint,
    {}, 
    { Authorization: basicAuth, Accept: 'application/json', 'Content-Type': 'application/json' }, // Headers
    bodyData 
  );

  
  expect(response.status).toBe(201);

  
  const user = response.data;
  expect(user).toHaveProperty('accountId');
  expect(user).toHaveProperty('emailAddress');
  expect(user).toHaveProperty('displayName');
});
