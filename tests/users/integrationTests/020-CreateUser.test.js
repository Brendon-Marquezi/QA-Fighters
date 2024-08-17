const RequestManager = require('#utils/requestManager');
const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const validateSchema = require('#configs/schemaValidation');

describe('Users', () => {
  let requestManager;
  let createdUserId;
  let userSchema;
  let bodyData;

  beforeEach(() => {
    requestManager = RequestManager.getInstance(env.environment.base_url);

    userSchema = {
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

    bodyData = {
      emailAddress: 'tks41607@tccho.com',
      products: [],
    };
  });

  test('Create a user in Jira', async () => {
    logger.info('Starting test: Create a user in Jira');

    const endpoint = 'user';

    const response = await requestManager.send(
      'post',
      endpoint,
      {},
      { Authorization: global.basicAuth },
      bodyData,
    );

    expect(response.status).toBe(201);

    const user = response.data;
    expect(user).toHaveProperty('self');
    expect(user).toHaveProperty('accountId');
    expect(user).toHaveProperty('accountType');
    expect(user).toHaveProperty('emailAddress');
    expect(user).toHaveProperty('avatarUrls');
    expect(user).toHaveProperty('displayName');
    expect(user).toHaveProperty('active');
    expect(user).toHaveProperty('timeZone');
    expect(user).toHaveProperty('locale');
    expect(user).toHaveProperty('groups');
    expect(user).toHaveProperty('applicationRoles');
    expect(user).toHaveProperty('expand');

    const validation = validateSchema(user, userSchema);
    if (validation.valid) {
      logger.info('User schema validation passed.');
    } else {
      logger.error(
        'User schema validation failed. Validation errors:',
        JSON.stringify(validation.errors, null, 2),
      );
    }

    createdUserId = user.accountId;
    logger.info(`User created successfully with ID: ${createdUserId}`);
  });

  afterEach(async () => {
    if (createdUserId) {
      logger.info(`Deleting user with ID ${createdUserId}...`);

      const endpoint = `user?accountId=${createdUserId}`;
      const response = await requestManager.send(
        'delete',
        endpoint,
        {},
        { Authorization: global.basicAuth },
      );

      if (response.status === 204) {
        logger.info(`User with ID ${createdUserId} deleted successfully.`);
      } else {
        logger.error(
          `Failed to delete user with ID ${createdUserId}. Status: ${response.status}`,
        );
      }

      createdUserId = null;
    }
  });
});
