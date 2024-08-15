const env = require('#configs/environments');
const RequestManager = require('#utils/requestManager');
const logger = require('#utils/logger')(__filename);
const validateSchema = require('#configs/schemaValidation');

const USER_ID = env.environment.account_id; 

// Esquema de validação atualizado
const bulkGetUsersResponseSchema = {
  type: 'object',
  properties: {
    self: { type: 'string' },
    maxResults: { type: 'integer' },
    startAt: { type: 'integer' },
    total: { type: 'integer' },
    isLast: { type: 'boolean' },
    values: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          self: { type: 'string' },
          accountId: { type: 'string' },
          accountType: { type: 'string' },
          avatarUrls: {
            type: 'object',
            properties: {
              '16x16': { type: 'string' },
              '24x24': { type: 'string' },
              '32x32': { type: 'string' },
              '48x48': { type: 'string' }
            },
            required: ['16x16', '24x24', '32x32', '48x48']
          },
          displayName: { type: 'string' },
          active: { type: 'boolean' },
          timeZone: { type: 'string' }
        },
        required: [
          'self',
          'accountId',
          'accountType',
          'avatarUrls',
          'displayName',
          'active',
          'timeZone'
        ]
      }
    }
  },
  required: ['self', 'maxResults', 'startAt', 'total', 'isLast', 'values'],
  additionalProperties: false
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

  // Validar a resposta com o esquema
  const validation = validateSchema(response.data, bulkGetUsersResponseSchema);


  if (!validation.valid) {
    logger.error('Validation errors:', validation.errors);
  }

  expect(validation.valid).toBe(true);
  expect(response.status).toBe(200); 
});