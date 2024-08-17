const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');
const validateSchema = require('#configs/schemaValidation');

describe('Project', () => {
  let requestManager;
  let projectListSchema;

  beforeEach(() => {
    logger.info('Starting the test setup');
    requestManager = RequestManager.getInstance(env.environment.base_url);

    projectListSchema = {
      type: 'object',
      properties: {
        values: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              key: { type: 'string' },
              name: { type: 'string' },
            },
            required: ['key', 'name'],
          },
        },
      },
      required: ['values'],
    };
  });

  test('Check if all visible projects can be listed', async () => {
    logger.info('Starting to list all visible projects');

    const response = await requestManager.send(
      'get',
      'project/search',
      {},
      { Authorization: global.basicAuth },
    );

    logger.info('Response received for visible projects');

    // Validate the schema of the project list response
    const projectListValidationResult = validateSchema(
      response.data,
      projectListSchema,
    );
    if (!projectListValidationResult.valid) {
      logger.error(
        `Schema validation failed for project list response: ${projectListValidationResult.errors.map((e) => e.message).join(', ')}`,
      );
    }

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data.values)).toBe(true);
    expect(response.data.values.length).toBeGreaterThan(0);
  });
});
