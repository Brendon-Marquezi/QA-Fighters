const env = require('#configs/environments');
const RequestManager = require('#utils/requestManager');
const logger = require('#utils/logger')(__filename);
const validateSchema = require('#configs/schemaValidation');

describe('Users', () => {
  let requestManager;
  let getUserGroupsResponseSchema;

  beforeEach(async () => {
    getUserGroupsResponseSchema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          groupId: { type: 'string' },
          name: { type: 'string' },
          self: { type: 'string' },
        },
        required: ['groupId', 'name', 'self'],
      },
    };
  });

  test('Get user groups from Jira', async () => {
    const accountId = env.environment.account_id;
    requestManager = RequestManager.getInstance(env.environment.base_url);

    const response = await requestManager.send(
      'get',
      `user/groups?accountId=${accountId}`,
      {},
      { Authorization: global.basicAuth, Accept: 'application/json' },
    );

    expect(response.status).toBe(200);

    const validation = validateSchema(
      response.data,
      getUserGroupsResponseSchema,
    );

    if (!validation.valid) {
      logger.error('Validation errors:', validation.errors);
    }

    expect(validation.valid).toBe(true);

    response.data.forEach((group) => {
      expect(group).toHaveProperty('groupId');
      expect(group).toHaveProperty('name');
      expect(group).toHaveProperty('self');

      logger.info(
        `groupId: "${group.groupId}", name: "${group.name}", self: "${group.self}"`,
      );
    });

    logger.info('Get user groups test passed successfully.');
  });
});
