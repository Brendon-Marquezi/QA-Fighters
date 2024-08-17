const RequestManager = require('#utils/requestManager');
const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const validateSchema = require('#configs/schemaValidation');

describe('Users', () => {
  let requestManager;
  let createdUserId;
  let getUserResponseSchema;

  beforeEach(() => {
    requestManager = RequestManager.getInstance(env.environment.base_url);

    getUserResponseSchema = {
      type: 'object',
      properties: {
        self: { type: 'string' },
        accountId: { type: 'string' },
        accountType: { type: 'string' },
        active: { type: 'boolean' },
        avatarUrls: {
          type: 'object',
          properties: {
            '16x16': { type: 'string' },
            '24x24': { type: 'string' },
            '32x32': { type: 'string' },
            '48x48': { type: 'string' },
          },
          required: ['16x16', '24x24', '32x32', '48x48'],
        },
        displayName: { type: 'string' },
        timeZone: { type: 'string' },
        locale: { type: 'string' },
        groups: {
          type: 'object',
          properties: {
            size: { type: 'integer' },
            items: {
              type: 'array',
              items: { type: 'object' },
            },
          },
        },
        applicationRoles: {
          type: 'object',
          properties: {
            size: { type: 'integer' },
            items: {
              type: 'array',
              items: { type: 'object' },
            },
          },
        },
        expand: { type: 'string' },
      },
      required: [
        'self',
        'accountId',
        'accountType',
        'active',
        'avatarUrls',
        'displayName',
      ],
      additionalProperties: false,
    };
  });

  test('Create a user if not exists and then get specific user from Jira', async () => {
    logger.info(
      'Starting test: Create a user if not exists and then get specific user from Jira',
    );

    const email = env.environment.emailAddress;
    if (!email) {
      logger.error('Email is not defined in the environment configuration.');
      throw new Error('Email is not defined');
    }
    logger.info(`Email found: ${email}`);

    const displayName = email.split('@')[0];

    logger.info('Checking if user already exists...');
    const allUsersResponse = await requestManager.send(
      'get',
      'user/search',
      { query: `emailAddress=${email}` },
      { Authorization: global.basicAuth },
    );

    if (allUsersResponse.status === 200) {
      const existingUser = allUsersResponse.data.find(
        (user) => user.emailAddress === email,
      );

      if (existingUser) {
        createdUserId = existingUser.accountId;
        logger.info('User already exists. Deleting the existing user...');
        await requestManager.send(
          'delete',
          `user/${createdUserId}`,
          {},
          { Authorization: global.basicAuth, Accept: 'application/json' },
        );
        logger.info('Existing user deleted.');
      }
    } else {
      logger.error(
        `Failed to fetch all users. Status: ${allUsersResponse.status}`,
      );
    }

    logger.info('Creating a new user...');
    const createUserResponse = await requestManager.send(
      'post',
      'user',
      {},
      {
        Authorization: global.basicAuth,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      {
        emailAddress: email,
        displayName: displayName,
        active: true,
        groups: { size: 0, items: [] },
        applicationRoles: { size: 0, items: [] },
        timeZone: 'America/Sao_Paulo',
        locale: 'pt_BR',
        avatarUrls: {
          '48x48': 'http://example.com/48x48.png',
          '24x24': 'http://example.com/24x24.png',
          '16x16': 'http://example.com/16x16.png',
          '32x32': 'http://example.com/32x32.png',
        },
        accountType: 'atlassian',
        expand: 'groups,applicationRoles',
        products: [],
      },
    );

    logger.info(`Create user response status: ${createUserResponse.status}`);

    expect(createUserResponse.status).toBe(201);

    const createdUser = createUserResponse.data;
    expect(createdUser).toHaveProperty('self');
    expect(createdUser).toHaveProperty('accountId');
    expect(createdUser).toHaveProperty('emailAddress');

    createdUserId = createdUser.accountId;
    logger.info(`User created successfully with ID: ${createdUserId}`);

    logger.info(`Retrieving the user with ID: ${createdUserId}`);
    const getResponse = await requestManager.send(
      'get',
      `user?accountId=${createdUserId}`,
      {},
      { Authorization: global.basicAuth, Accept: 'application/json' },
    );

    logger.info(`Get user response status: ${getResponse.status}`);

    expect(getResponse.status).toBe(200);

    const validationGet = validateSchema(
      getResponse.data,
      getUserResponseSchema,
    );
    expect(validationGet.valid).toBe(true);

    if (getResponse.data) {
      logger.info('User data successfully retrieved.');
    } else {
      logger.error('Failed to retrieve user data.');
    }
  });

  afterEach(async () => {
    if (createdUserId) {
      logger.info(`Deleting user with ID ${createdUserId}...`);

      const endpoint = `user?accountId=${createdUserId}`;
      const response = await requestManager.send(
        'delete',
        endpoint,
        {},
        { Authorization: global.basicAuth, Accept: 'application/json' },
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

    global.basicAuth = null;
    logger.info('Global authentication cleared.');
  });
});
