const RequestManager = require('#utils/requestManager');
const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const validateSchema = require('#configs/schemaValidation');

// Esquema de validação
const userSchema = {
  type: 'object',
  properties: {
    self: { type: 'string' },
    accountId: { type: 'string' },
    accountType: { type: 'string' },
    emailAddress: { type: 'string' },
    avatarUrls: {
      type: 'object',
      properties: {
        '48x48': { type: 'string' },
        '24x24': { type: 'string' },
        '16x16': { type: 'string' },
        '32x32': { type: 'string' }
      },
      required: ['48x48', '24x24', '16x16', '32x32'],
      additionalProperties: false
    },
    displayName: { type: 'string' },
    active: { type: 'boolean' },
    timeZone: { type: 'string' },
    locale: { type: 'string' },
    groups: {
      type: 'object',
      properties: {
        size: { type: 'number' },
        items: { type: 'array', items: { type: 'object' } }
      },
      required: ['size', 'items'],
      additionalProperties: false
    },
    applicationRoles: {
      type: 'object',
      properties: {
        size: { type: 'number' },
        items: { type: 'array', items: { type: 'object' } }
      },
      required: ['size', 'items'],
      additionalProperties: false
    },
    expand: { type: 'string' }
  },
  required: [
    'self', 'accountId', 'accountType', 'emailAddress', 'avatarUrls',
    'displayName', 'active', 'timeZone', 'locale', 'groups', 'applicationRoles', 'expand'
  ],
  additionalProperties: false
};

let requestManager;
let createdUserId = null;

beforeEach(() => {
  // Request Manager antes do teste
  requestManager = RequestManager.getInstance(env.environment.base_url);
  global.basicAuth =
    'Basic ' +
    Buffer.from(
      `${env.environment.username}:${env.environment.api_token}`
    ).toString('base64');
  logger.info('Global authentication setup completed.');
});

afterEach(async () => {
  // Limpeza após o teste
  if (createdUserId) {
    logger.info(`Deleting user with ID ${createdUserId}...`);

    try {
      const endpoint = `user?accountId=${createdUserId}`;
      const response = await requestManager.send(
        'delete',
        endpoint,
        {},
        { Authorization: global.basicAuth, Accept: 'application/json' }
      );

      if (response.status === 204) {
        logger.info(`User with ID ${createdUserId} deleted successfully.`);
      } else {
        logger.error(`Failed to delete user with ID ${createdUserId}. Status: ${response.status}`);
      }
    } catch (error) {
      logger.error(`Error deleting user with ID ${createdUserId}: ${error.message}`);
    }

    createdUserId = null; 
  }

  global.basicAuth = null;
  logger.info('Global authentication cleared.');
});

test('Create a user in Jira', async () => {
  logger.info('Starting test: Create a user in Jira');

  const endpoint = 'user'; 

  // Dados do usuário
  const bodyData = {
    emailAddress: 'tks41607@tccho.com',
    products: [] 
  };

  logger.info(`Request details: ${JSON.stringify({
    method: 'POST',
    url: `${env.environment.base_url}/${endpoint}`,
    headers: { Authorization: global.basicAuth, Accept: 'application/json', 'Content-Type': 'application/json' },
    data: bodyData
  }, null, 2)}`);

  const response = await requestManager.send(
    'post',
    endpoint,
    {},
    { Authorization: global.basicAuth, Accept: 'application/json', 'Content-Type': 'application/json' },
    bodyData 
  );

  // Logar apenas accountId e emailAddress
  logger.info(`Response details: ${JSON.stringify({
    status: response.status,
    data: {
      accountId: response.data.accountId,
      emailAddress: response.data.emailAddress
    },
    headers: response.headers
  }, null, 2)}`);

  // Verifica
  expect(response.status).toBe(201);

  const user = response.data;
  expect(user).toHaveProperty('self');
  expect(user).toHaveProperty('accountId');
  expect(user).toHaveProperty('accountType');
  expect(user).toHaveProperty('emailAddress');
  expect(user).toHaveProperty('avatarUrls');
  expect(user).toHaveProperty('displayName');
  expect(user).toHaveProperty('active');
  expect(user).toHaveProperty('timeZone');
  expect(user).toHaveProperty('locale');
  expect(user).toHaveProperty('groups');
  expect(user).toHaveProperty('applicationRoles');
  expect(user).toHaveProperty('expand');

  // Valida a resposta
  const validation = validateSchema(user, userSchema);
  if (validation.valid) {
    logger.info('User schema validation passed.');
  } else {
    logger.error('User schema validation failed. Validation errors:', JSON.stringify(validation.errors, null, 2));
  }

  // Armazena o ID do usuário para futuras exclusões
  createdUserId = user.accountId;
  logger.info(`User created successfully with ID: ${createdUserId}`);
});
