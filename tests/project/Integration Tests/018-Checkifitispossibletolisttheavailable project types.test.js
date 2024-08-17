const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');
const validateSchema = require('#configs/schemaValidation');

describe('Project', () => {
  let requestManager;
  let projectTypeSchema;

  beforeEach(() => {
    logger.info('Starting the test setup');
    requestManager = RequestManager.getInstance(env.environment.base_url);

    projectTypeSchema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: {
            type: 'string',
          },
          formattedKey: {
            type: 'string',
          },
          descriptionI18nKey: {
            type: 'string',
          },
          icon: {
            type: 'string',
          },
          color: {
            type: 'string',
          },
        },
        required: [
          'key',
          'formattedKey',
          'descriptionI18nKey',
          'icon',
          'color',
        ],
      },
    };
  });

  test('Check if it is possible to list the available project types', async () => {
    logger.info('Starting the listing of available project types');

    const response = await requestManager.send(
      'get',
      'project/type',
      {},
      { Authorization: global.basicAuth },
    );

    logger.info('Response received for project types');

    const projectTypeValidationResult = validateSchema(
      response.data,
      projectTypeSchema,
    );

    if (projectTypeValidationResult.valid) {
      logger.info('-schemaValidator- Response matches schema.');
    } else {
      logger.error(
        '-schemaValidator- Response does not match schema. Validation errors:',
        projectTypeValidationResult.errors,
      );
    }

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
  });
});
