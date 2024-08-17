const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');
const validateSchema = require('#configs/schemaValidation');

describe('Project', () => {
  let requestManager;
  let projectKey;
  let projectSchema;

  beforeEach(async () => {
    logger.info('Starting the test setup');
    requestManager = RequestManager.getInstance(env.environment.base_url);

    projectKey = 'EX';

    projectSchema = {
      type: 'object',
      properties: {
        key: { type: 'string' },
        name: { type: 'string' },
      },
      required: ['key', 'name'],
    };
  });

  test('Check if you can get the details of a project', async () => {
    logger.info(`Starting to get details for project ${projectKey}`);

    const response = await requestManager.send(
      'get',
      `project/${projectKey}`,
      {},
      { Authorization: global.basicAuth },
    );

    // Validate the schema for the project details response
    const projectValidationResult = validateSchema(
      response.data,
      projectSchema,
    );
    if (!projectValidationResult.valid) {
      logger.error(
        `Schema validation failed for project details: ${projectValidationResult.errors.map((e) => e.message).join(', ')}`,
      );
      throw new Error('Schema validation failed');
    }

    logger.info(`Received response for project ${projectKey}`);

    expect(response.status).toBe(200);
    expect(response.data.key).toBe(projectKey);
    expect(response.data.name).toBe('Example');

    logger.info('Finished test execution');
  });
});
