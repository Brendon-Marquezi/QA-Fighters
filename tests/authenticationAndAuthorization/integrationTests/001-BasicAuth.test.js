const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');
const validateSchema = require('#configs/schemaValidation');

describe('Authentication and Authorization', () => {
  let requestManager;
  let projectListSchema;

  beforeEach(() => {
    requestManager = RequestManager.getInstance(env.environment.base_url);

    projectListSchema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
        },
        required: ['id', 'name'],
      },
    };
  });

  test('Verify basic authentication functionality', async () => {
    const response = await requestManager.send(
      'get',
      'events',
      {},
      { Authorization: global.basicAuth },
    );

    expect(response.status).toBe(200);
    expect(response.data[0]).toHaveProperty('name');

    if (response.status === 200) {
      const validation = validateSchema(response.data, projectListSchema);
      if (validation.valid) {
        logger.info('-schemaValidator- Response matches schema.');
      } else {
        logger.error(
          '-schemaValidator- Response does not match schema. Validation errors:',
          validation.errors,
        );
      }
    }
  });
});
