const env = require('#configs/environments');
const RequestManager = require('#utils/requestManager');
const logger = require('#utils/logger')(__filename); // Adicionando o logger

let requestManager;

// Esquema de validação
const getUserDefaultColumnsResponseSchema = {
  status: 200,
  data: [
    {
      label: "string",
      value: "string"
    }
  ]
};

test('Get user default columns from Jira', async () => {
  logger.info('Test: Get user default columns from Jira');

  requestManager = RequestManager.getInstance(env.environment.base_url);
  const accountId = env.environment.account_id; 

  const response = await requestManager.send(
    'get',
    `user/columns${accountId ? `?accountId=${accountId}` : ''}`,
    {},
    { Authorization: global.basicAuth, Accept: 'application/json' }
  );
  
  expect(response.status).toBe(getUserDefaultColumnsResponseSchema.status);

  expect(response.data).toBeInstanceOf(Array);


  response.data.forEach((column) => {
    expect(column).toHaveProperty('label');
    expect(column).toHaveProperty('value');
  });

  logger.info('Get user default columns test passed successfully.');
});
