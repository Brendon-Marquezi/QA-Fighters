const env = require('#configs/environments');
const RequestManager = require('#utils/requestManager');
const logger = require('#utils/logger')(__filename);
const validateSchema = require('#configs/schemaValidation');

describe('Users', () => {
  let requestManager;
  let printAllUsers;
  let getAllUsersResponseSchema;

  beforeEach(async () => {
    requestManager = RequestManager.getInstance(env.environment.base_url);

    printAllUsers = true;

    getAllUsersResponseSchema = {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
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
              self: { type: 'string' },
            },
            required: [
              'accountId',
              'accountType',
              'active',
              'avatarUrls',
              'displayName',
              'self',
            ],
          },
        },
      },
      required: ['data'],
    };
  });

  test('Get all users from Jira', async () => {
    logger.info('Test: Get all users from Jira');

    const endpoint = 'users/search';

    const response = await requestManager.send(
      'get',
      endpoint,
      {},
      { Authorization: global.basicAuth, Accept: 'application/json' },
    );

    logger.info('Response Status:', response.status);
    logger.info('Response Headers:', JSON.stringify(response.headers, null, 2));

    expect(response.status).toBe(200);

    expect(Array.isArray(response.data)).toBe(true);

    const responseBody = { data: response.data };
    const validation = validateSchema(responseBody, getAllUsersResponseSchema);

    if (!validation.valid) {
      logger.error(
        'Response schema validation failed. Validation errors:',
        JSON.stringify(validation.errors, null, 2),
      );
    }

    expect(validation.valid).toBe(true);

    if (response.data.length > 0) {
      response.data.forEach((user) => {
        expect(user).toMatchObject({
          accountId: expect.any(String),
          accountType: expect.any(String),
          active: expect.any(Boolean),
          avatarUrls: {
            '16x16': expect.any(String),
            '24x24': expect.any(String),
            '32x32': expect.any(String),
            '48x48': expect.any(String),
          },
          displayName: expect.any(String),
          self: expect.any(String),
        });
      });
    } else {
      logger.info('No users found.');
    }
  });
});
