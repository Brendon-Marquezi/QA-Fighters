const env = require('#configs/environments');
const RequestManager = require('#utils/requestManager');
const logger = require('#utils/logger')(__filename);
const validateSchema = require('#configs/schemaValidation');

let requestManager;
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
    emailAddress: env.environment.emailAddress,
    products: []
  };

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

  // Esquema de validação local ao teste
  const deleteResponseSchema = {
    type: 'object',
    properties: {
      status: { type: 'number', enum: [204] }
    },
    required: ['status'],
    additionalProperties: false
  };

  // Validação da resposta do DELETE usando validateSchema
  const validation = validateSchema({ status: response.status }, deleteResponseSchema);
  if (!validation.valid) {
    logger.error('Response schema validation failed. Validation errors:', JSON.stringify(validation.errors, null, 2));
    throw new Error('Response schema validation failed');
  }

  logger.info(`User with ID ${createdUserId} deleted successfully.`);
  createdUserId = null;
});

afterAll(() => {
  global.basicAuth = null;
  logger.info('Global authentication cleared.');
});
