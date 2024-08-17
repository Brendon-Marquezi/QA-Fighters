const env = require('#configs/environments');
const RequestManager = require('#utils/requestManager');
const logger = require('#utils/logger')(__filename);
const validateSchema = require('#configs/schemaValidation');

describe('Users', () => {
  let requestManager;
  let createdUserId;
  let createResponseSchema;

  beforeEach(async () => {
    logger.info('Global authentication setup completed.');
    requestManager = RequestManager.getInstance(env.environment.base_url);

    createResponseSchema = {
      type: 'object',
      properties: {
        self: { type: 'string' },
        accountId: { type: 'string' },
        accountType: { type: 'string' },
        emailAddress: { type: 'string' },
        avatarUrls: {
          type: 'object',
          properties: {
            '48x48': { type: 'string' },
            '24x24': { type: 'string' },
            '16x16': { type: 'string' },
            '32x32': { type: 'string' },
          },
          required: ['48x48', '24x24', '16x16', '32x32'],
          additionalProperties: false,
        },
        displayName: { type: 'string' },
        active: { type: 'boolean' },
        timeZone: { type: 'string' },
        locale: { type: 'string' },
        groups: {
          type: 'object',
          properties: {
            size: { type: 'number' },
            items: { type: 'array', items: { type: 'object' } },
          },
          required: ['size', 'items'],
          additionalProperties: false,
        },
        applicationRoles: {
          type: 'object',
          properties: {
            size: { type: 'number' },
            items: { type: 'array', items: { type: 'object' } },
          },
          required: ['size', 'items'],
          additionalProperties: false,
        },
        expand: { type: 'string' },
      },
      required: [
        'self',
        'accountId',
        'accountType',
        'emailAddress',
        'avatarUrls',
        'displayName',
        'active',
        'timeZone',
        'locale',
        'groups',
        'applicationRoles',
        'expand',
      ],
      additionalProperties: false,
    };

    const createUserResponse = await requestManager.send(
      'post',
      'user',
      {},
      { Authorization: global.basicAuth },
      {
        emailAddress: env.environment.emailAddress,
        products: [],
      },
    );

    expect(createUserResponse.status).toBe(201);

    const validation = validateSchema(
      createUserResponse.data,
      createResponseSchema,
    );
    if (!validation.valid) {
      logger.error(
        'Response schema validation failed. Validation errors:',
        JSON.stringify(validation.errors, null, 2),
      );
      logger.error('Response schema validation failed');
    }

    if (createUserResponse.status === 201) {
      createdUserId = createUserResponse.data.accountId;
      logger.info('User created successfully for deletion test.');
    } else {
      logger.error('Failed to create user for deletion test');
    }
  });

  test('Delete a user from Jira', async () => {
    logger.info('Test: Delete a user from Jira');

    expect(createdUserId).toBeTruthy();

    const response = await requestManager.send(
      'delete',
      `user?accountId=${createdUserId}`,
      {},
      { Authorization: global.basicAuth, Accept: 'application/json' },
    );

    expect(response.status).toBe(204);

    logger.info(`User with ID ${createdUserId} deleted successfully.`);
  });
});
