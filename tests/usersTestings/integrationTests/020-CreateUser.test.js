const env = require('#configs/environments');
const RequestManager = require('#utils/requestManager');


let requestManager;

test('Create a user in Jira', async () => {
  const endpoint = 'user'; 
  requestManager = RequestManager.getInstance(env.environment.base_url);

  
  const bodyData = {
    emailAddress: 'gefatar68111@biowey.com', // Email
    products: [], // Produtos associados ao usuário
  };

  const response = await requestManager.send(
    'post',
    endpoint,
    {}, 
    { Authorization: global.basicAuth, Accept: 'application/json', 'Content-Type': 'application/json' }, // Headers
    bodyData 
  );

  
  expect(response.status).toBe(201);

  
  const user = response.data;
  expect(user).toHaveProperty('accountId');
  expect(user).toHaveProperty('emailAddress');
  expect(user).toHaveProperty('displayName');
});
