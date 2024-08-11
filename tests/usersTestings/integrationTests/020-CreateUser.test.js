// tests/usersTestings/integrationTests/020-CreateUser.test.js
const RequestManager = require('#utils/requestManager');
const env = require('#configs/environments');

const requestManager = RequestManager.getInstance(env.environment.base_url);

beforeAll(() => {
  global.basicAuth =
    'Basic ' +
    Buffer.from(
      `${env.environment.username}:${env.environment.api_token}`
    ).toString('base64');
});

afterAll(() => {
  global.basicAuth = null;
});

test('Create a user in Jira', async () => {
  const endpoint = 'user'; 
  
  const bodyData = {
    emailAddress: 'ifj93260@zccck.com', // Email
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
