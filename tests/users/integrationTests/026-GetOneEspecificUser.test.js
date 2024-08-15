const env = require('#configs/environments');
const RequestManager = require('#utils/requestManager');
const logger = require('#utils/logger')(__filename);

const printUserInfo = true; // Definir TRUE para habilitar impressão

// Esquema de validação
const getUserResponseSchema = {
  status: 200,
  data: {
    accountId: expect.any(String),
    accountType: expect.any(String),
    active: expect.any(Boolean),
    avatarUrls: {
      "16x16": expect.any(String),
      "24x24": expect.any(String),
      "32x32": expect.any(String),
      "48x48": expect.any(String)
    },
    displayName: expect.any(String),
    self: expect.any(String)
  }
};

let requestManager;

test('Get a specific user from Jira', async () => {
  logger.info('Test: Get a specific user from Jira');

  requestManager = RequestManager.getInstance(env.environment.base_url);
  const accountId = env.environment.account_id; // Pegando o accountId do env.json

  const response = await requestManager.send(
    'get',
    `user?accountId=${accountId}`,
    {},
    { Authorization: global.basicAuth, Accept: 'application/json' }
  );

  expect(response.status).toBe(getUserResponseSchema.status);

  expect(response.data).toMatchObject(getUserResponseSchema.data);

  logger.info('User data successfully retrieved.');
});
