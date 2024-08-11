// tests/usersTestings/integrationTests/021-DeleteUser.test.js
const RequestManager = require('#utils/requestManager');
const env = require('#configs/environments');

const requestManager = RequestManager.getInstance(env.environment.base_url);

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`
  ).toString('base64');

let accountIdToDelete;

beforeAll(async () => {
  // Criação de um usuário para exclusão no teste
  const endpoint = 'user'; 
  requestManager = RequestManager.getInstance(env.environment.base_url);

  
  const bodyData = {
    emailAddress: 'tologos932@almaxen.com',
    products: [],
  };

  const response = await requestManager.send(
    'post',
    endpoint,
    {}, 
    { Authorization: global.basicAuth, Accept: 'application/json', 'Content-Type': 'application/json' },
    bodyData 
  );

  if (response.status === 201) {
    accountIdToDelete = response.data.accountId;
  } else {
    throw new Error('Failed to create user for deletion test');
  }
});

afterAll(async () => {
  // Exclusão do usuário criado após o teste
  if (accountIdToDelete) {
    const endpoint = `user?accountId=${accountIdToDelete}`;
    const response = await requestManager.send(
      'delete',
      endpoint,
      {}, 
      { Authorization: global.basicAuth, Accept: 'application/json' }
    );
    if (response.status !== 204) {
      throw new Error('Failed to delete test user');
    }
  }
});

test('Delete a user from Jira', async () => {
  expect(accountIdToDelete).toBeTruthy();

  const endpoint = `user?accountId=${accountIdToDelete}`;

  const response = await requestManager.send(
    'delete',
    endpoint,
    {}, 
    { Authorization: global.basicAuth, Accept: 'application/json' }
  );

  expect(response.status).toBe(204);
  expect(response.data).toBe('');
});
