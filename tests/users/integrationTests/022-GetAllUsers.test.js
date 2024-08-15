const env = require('#configs/environments');
const RequestManager = require('#utils/requestManager');
const logger = require('#utils/logger')(__filename);


const printAllUsers = false; // Definir TRUE para habilitar impressão

// Esquema de validação
const getAllUsersResponseSchema = {
  status: 200,
  data: [
    {
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
  ]
};

let requestManager;

test('Get all users from Jira', async () => {
  logger.info('Test: Get all users from Jira');

  requestManager = RequestManager.getInstance(env.environment.base_url);
  const endpoint = 'users/search'; 

  // Enviar solicitação e obter resposta
  const response = await requestManager.send(
    'get',
    endpoint,
    {}, 
    { Authorization: global.basicAuth, Accept: 'application/json' } 
  );

  logger.info('Response from API:', response);

  // Validação do status da resposta
  expect(response.status).toBe(getAllUsersResponseSchema.status);
  
  // Validação dos dados da resposta
  expect(Array.isArray(response.data)).toBe(true);
  
  if (response.data.length > 0) {
    response.data.forEach(user => {
      expect(user).toMatchObject({
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
      });
    });
  } else {
    logger.info('No users found.');
  }
});
