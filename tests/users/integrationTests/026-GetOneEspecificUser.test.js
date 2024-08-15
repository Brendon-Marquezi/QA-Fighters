const env = require('#configs/environments');
const RequestManager = require('#utils/requestManager');
const logger = require('#utils/logger')(__filename);
const validateSchema = require('#configs/schemaValidation'); 

const printUserInfo = true; // Definir TRUE para habilitar impressão

// Esquema de validação para a resposta
const getUserResponseSchema = {
  type: 'object',
  properties: {
    self: { type: 'string' },
    accountId: { type: 'string' },
    accountType: { type: 'string' },
    active: { type: 'boolean' },
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
    timeZone: { type: 'string' }, // Adicionar timeZone
    locale: { type: 'string' },    // Adicionar locale
    groups: {
      type: 'object',
      properties: {
        size: { type: 'integer' },
        items: {
          type: 'array',
          items: { type: 'object' }
        }
      }
    },
    applicationRoles: {
      type: 'object',
      properties: {
        size: { type: 'integer' },
        items: {
          type: 'array',
          items: { type: 'object' }
        }
      }
    },
    expand: { type: 'string' } // Adicionar expand
  },
  required: ['self', 'accountId', 'accountType', 'active', 'avatarUrls', 'displayName'],
  additionalProperties: false

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

  // Validar o status
  expect(response.status).toBe(200);

  // Validar a resposta com o esquema
  const validation = validateSchema(response.data, getUserResponseSchema);

  if (!validation.valid) {
    logger.error('Validation errors:', validation.errors);
    console.log('Validation errors:', validation.errors); 
  }

  expect(validation.valid).toBe(true);


  logger.info('User data successfully retrieved.');

});

