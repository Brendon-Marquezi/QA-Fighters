const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');
const validateSchema = require('#configs/schemaValidation');

let requestManager;

// Definir o schema personalizado para o usuário criado
const userSchema = {
  type: 'object',
  properties: {
    accountId: { type: 'string' },
    emailAddress: { type: 'string' },
    displayName: { type: 'string' },
  },
  required: ['accountId', 'emailAddress', 'displayName'],
};

test('Create a user in Jira', async () => {
  logger.info('Starting test: Create a user in Jira');

  const endpoint = 'user'; 
  requestManager = RequestManager.getInstance(env.environment.base_url);

  // Dados do corpo da requisição
  const bodyData = {
    emailAddress: 'gefatar681112@biowey.com', 
    products: [], 
  };

  // Enviar requisição de criação do usuário
  const response = await requestManager.send(
    'post',
    endpoint,
    {}, 
    { Authorization: global.basicAuth, Accept: 'application/json', 'Content-Type': 'application/json' }, 
    bodyData 
  );

  // Verificar se o status da resposta é 201 (Criado)
  expect(response.status).toBe(201);
  logger.info('User created successfully with status 201.');

  // Validar o esquema da resposta
  const user = response.data;
  const validation = validateSchema(user, userSchema);
  if (validation.valid) {
    logger.info('Response matches schema.');
  } else {
    logger.error('Response does not match schema. Validation errors:', validation.errors);
    throw new Error('Schema validation failed');
  }

  // Verificar se a resposta contém as propriedades esperadas
  expect(user).toHaveProperty('accountId');
  expect(user).toHaveProperty('emailAddress');
  expect(user).toHaveProperty('displayName');
  logger.info('User has required properties: accountId, emailAddress, displayName.');
});
