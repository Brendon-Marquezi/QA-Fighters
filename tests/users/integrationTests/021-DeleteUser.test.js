const env = require('#configs/environments');
const RequestManager = require('#utils/requestManager');
const logger = require('#utils/logger')(__filename);

let requestManager;

// Esquema de validação
const deleteResponseSchema = {
  status: 204,
  data: '' // A resposta deve ser uma string vazia
};

let createdUserId = null;

beforeEach(async () => {
  // Configuração do Request Manager
  requestManager = RequestManager.getInstance(env.environment.base_url);
  global.basicAuth =
    'Basic ' +
    Buffer.from(
      `${env.environment.username}:${env.environment.api_token}`
    ).toString('base64');
  logger.info('Global authentication setup completed.');

  // Criação de um usuário para exclusão no teste
  const endpoint = 'user';
  const bodyData = {
    emailAddress: 'nnd21315@tccho.com',
    products: []
  };

  // Criação do usuário e logging com mensagem de sucesso
  const response = await requestManager.send(
    'post',
    endpoint,
    {},
    { Authorization: global.basicAuth, Accept: 'application/json', 'Content-Type': 'application/json' },
    bodyData
  );

  if (response.status === 201) {
    createdUserId = response.data.accountId;
    logger.info('User created successfully for deletion test.');
  } else {
    throw new Error('Failed to create user for deletion test');
  }
});

test('Delete a user from Jira', async () => {
  logger.info('Test: Delete a user from Jira');

  expect(createdUserId).toBeTruthy();

  const endpoint = `user?accountId=${createdUserId}`;

  const response = await requestManager.send(
    'delete',
    endpoint,
    {},
    { Authorization: global.basicAuth, Accept: 'application/json' }
  );

  // Validação da resposta do DELETE
  expect(response.status).toBe(deleteResponseSchema.status); 

  // Verifica que o corpo da resposta está vazio
  expect(response.data).toBe(deleteResponseSchema.data);

  logger.info(`User with ID ${createdUserId} deleted successfully.`);
  createdUserId = null;
});

afterAll(() => {
  global.basicAuth = null;
  logger.info('Global authentication cleared.');
});
