const requestManager = require('#utils/requestManager');
const env = require('#configs/environments').environment;

const basicAuth = 'Basic ' + Buffer.from(
  `${env.username}:${env.api_token}`
).toString('base64');

const jsonData = {
  emailAddress: 'testuser@atlassian.com',
  displayName: 'Test User',
  password: 'TestPassword123!'
};

let userId;

test('Create a new user', async () => {
  const response = await requestManager.send(
    'post',
    'user',
    {},
    { Authorization: `${basicAuth}`, 'Content-Type': 'application/json' },
    jsonData
  );

  expect(response.status).toBe(201);
  expect(response.data).toHaveProperty('accountId');

  userId = response.data.accountId;

  expect(response.data).toHaveProperty('self');
  expect(response.data.self).toBe(
    `${env.base_url}user/${userId}`
  );
});

afterAll(async () => {
  if (userId) {
    await requestManager.send(
      'delete',
      `user/${userId}`,
      {},
      { Authorization: `${basicAuth}` }
    );
  }
});
