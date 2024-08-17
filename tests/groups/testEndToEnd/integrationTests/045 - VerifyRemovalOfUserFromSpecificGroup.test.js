const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');
const validateSchema = require('#configs/schemaValidation');

describe('Groups', () => {
  let requestManager;
  let createdGroupId;
  let userIdToAdd;
  let groupSchema;

  beforeEach(async () => {
    requestManager = RequestManager.getInstance(env.environment.base_url);

    userIdToAdd = env.environment.client_id;

    groupSchema = {
      type: 'object',
      properties: {
        self: { type: 'string' },
        maxResults: { type: 'number' },
        startAt: { type: 'number' },
        total: { type: 'number' },
        isLast: { type: 'boolean' },
        values: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              accountId: { type: 'string' },
              displayName: { type: 'string' },
            },
            required: [],
          },
        },
      },
      required: ['self', 'maxResults', 'startAt', 'total', 'isLast', 'values'],
    };
  });

  test('Verify removal of user from specific group', async () => {
    logger.info('Starting group creation and user addition.');

    // Group creation
    const searchResponse = await requestManager.send(
      'get',
      `groups/picker?query=${encodeURIComponent(env.environment.group_name)}`,
      {},
      { Authorization: global.basicAuth },
    );

    const existingGroup = searchResponse.data.groups.find(
      (group) => group.name === env.environment.group_name,
    );

    if (existingGroup) {
      createdGroupId = existingGroup.groupId;
      logger.info(`Existing group found with ID: ${createdGroupId}`);
    } else {
      const createResponse = await requestManager.send(
        'post',
        'group',
        {},
        { Authorization: global.basicAuth },
        { name: 'teste600' },
      );
      createdGroupId = createResponse.data.groupId;
      logger.info(`Group created successfully with ID: ${createdGroupId}`);
    }

    // Add the user to the group
    const addUserResponse = await requestManager.send(
      'post',
      `group/user?groupId=${createdGroupId}`,
      {},
      { Authorization: global.basicAuth },
      { accountId: userIdToAdd },
    );

    if (addUserResponse.status === 201) {
      logger.info(`User ${userIdToAdd} added to group ${createdGroupId}.`);
    } else {
      logger.error(
        `Failed to add user ${userIdToAdd} to group ${createdGroupId}. Status: ${addUserResponse.status}`,
      );
    }

    logger.info('Starting test to verify removal of user from group.');

    // Remove user from group
    const removeUserResponse = await requestManager.send(
      'delete',
      `group/user?groupId=${createdGroupId}&accountId=${userIdToAdd}`,
      {},
      { Authorization: global.basicAuth },
    );

    expect(removeUserResponse.status).toBe(200);

    // Check if the user was actually removed
    const verifyGroupResponse = await requestManager.send(
      'get',
      `group/member?groupId=${createdGroupId}`,
      {},
      { Authorization: global.basicAuth },
    );

    logger.info(
      `Response: ${verifyGroupResponse.status} ${verifyGroupResponse.statusText}`,
    );

    // Apply schema validation
    if (verifyGroupResponse.status === 200) {
      logger.info('-schemaValidator- Group verification passed.');

      // Compare the response with the schema
      const validation = validateSchema(verifyGroupResponse.data, groupSchema);
      if (validation.valid) {
        logger.info('-schemaValidator- Response matches schema.');
      } else {
        logger.error(
          '-schemaValidator- Response does not match schema. Validation errors:',
          validation.errors,
        );
      }

      // Check if the user was removed
      const users = verifyGroupResponse.data.users?.values || [];
      const userInGroup = users.some(
        (member) => member.accountId === userIdToAdd,
      );

      if (!userInGroup) {
        logger.info(
          `User ${userIdToAdd} successfully removed from group ${createdGroupId}.`,
        );
      } else {
        logger.error(
          `User ${userIdToAdd} was not removed from group ${createdGroupId}.`,
        );
      }
    } else {
      logger.error(
        `Group verification failed. Status: ${verifyGroupResponse.status}`,
      );
    }
  }, 10000);

  afterEach(async () => {
    if (createdGroupId) {
      logger.info('Starting group deletion.');
      requestManager = RequestManager.getInstance(env.environment.base_url);

      // Delete the created group
      const deleteResponse = await requestManager.send(
        'delete',
        `group?groupId=${createdGroupId}`,
        {},
        { Authorization: global.basicAuth },
      );

      if (deleteResponse.status === 200) {
        logger.info(`Group ${createdGroupId} deleted successfully.`);
      } else {
        logger.error(
          `Failed to delete group ${createdGroupId}. Status: ${deleteResponse.status}`,
        );
      }
    } else {
      logger.error('No group ID available for deletion.');
    }
  });
});
