const env = require('#configs/environments');
const RequestManager = require('#utils/requestManager');
const logger = require('#utils/logger')(__filename);
const validateSchema = require('#configs/schemaValidation');

let requestManager;

// Esquema de validação atualizado
const getUserDefaultColumnsResponseSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: { type: 'string' },
      value: { type: 'string' }
    },
    required: ['label', 'value'],
    additionalProperties: false
  }
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
  
  expect(response.status).toBe(200);

  
  const schemaValidation = validateSchema(response.data, getUserDefaultColumnsResponseSchema);
  expect(schemaValidation.valid).toBe(true);

  if (!schemaValidation.valid) {
    console.error('Schema Validation Errors:', schemaValidation.errors);
  }

  expect(response.data).toBeInstanceOf(Array);


  response.data.forEach((column) => {
    expect(column).toHaveProperty('label');
    expect(column).toHaveProperty('value');

    console.log(`label: "${column.label}", value: "${column.value}"`);

  });

  logger.info('Get user default columns test passed successfully.');
});
