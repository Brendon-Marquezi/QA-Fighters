const env = require('#configs/environments');
const RequestManager = require('#utils/requestManager');
const logger = require('#utils/logger')(__filename);
const validateSchema = require('#configs/schemaValidation');

describe('Users', () => {
  let requestManager;
  let printUserInfo;
  let getUserResponseSchema;

  beforeEach(async () => {
    requestManager = RequestManager.getInstance(env.environment.base_url);

    printUserInfo = true;

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

  test('Get a specific user from Jira', async () => {
    logger.info('Test: Get a specific user from Jira');

    const accountId = env.environment.account_id;

    const response = await requestManager.send(
      'get',
      `user?accountId=${accountId}`,
      {},
      { Authorization: global.basicAuth, Accept: 'application/json' },
    );

    expect(response.status).toBe(200);

    const validation = validateSchema(response.data, getUserResponseSchema);

    if (!validation.valid) {
      logger.error('Validation errors:', validation.errors);
      console.log('Validation errors:', validation.errors);
    }

    expect(validation.valid).toBe(true);

    logger.info('User data successfully retrieved.');
  });
});
