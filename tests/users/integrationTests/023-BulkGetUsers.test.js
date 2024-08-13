const env = require('#configs/environments');
const RequestManager = require('#utils/requestManager');
const logger = require('#utils/logger')(__filename);

const USER_ID = env.environment.account_id; 

// Esquema de validação
const bulkGetUsersResponseSchema = {
  status: 200, // Status da resposta esperado
};

beforeEach(async () => {
  // Configuração do Request Manager
  requestManager = RequestManager.getInstance(env.environment.base_url);
  global.basicAuth =
    'Basic ' +
    Buffer.from(
      `${env.environment.username}:${env.environment.api_token}`
    ).toString('base64');
  logger.info('Global authentication setup completed.');
});

test('Bulk get users from Jira', async () => {
  logger.info('Test: Bulk get users from Jira');

  const endpoint = `user/bulk?accountId=${USER_ID}`;

  const response = await requestManager.send(
    'get',
    endpoint,
    {},
    { Authorization: global.basicAuth, Accept: 'application/json' }
  );

  console.log('Response from API:', response.data);

  expect(response.status).toBe(bulkGetUsersResponseSchema.status);
});

afterEach(async () => {
  // Nenhuma ação de limpeza necessária
});
