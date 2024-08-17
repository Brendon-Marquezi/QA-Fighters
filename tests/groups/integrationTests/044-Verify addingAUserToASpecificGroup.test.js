const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');
const validateSchema = require('#configs/schemaValidation');

describe('Groups', () => {
  let basicUserSchema;
  let userListSchema;
  let requestManager;
  let groupName;
  let accountIdToAdd;
  let createdGroupId;

  beforeEach(async () => {
    logger.info('Starting group creation.');
    requestManager = RequestManager.getInstance(env.environment.base_url);

    groupName = 'Teste900';

    accountIdToAdd = env.environment.client_id;

    basicUserSchema = {
      type: 'object',
      properties: {
        self: { type: 'string' },
        accountId: { type: 'string' },
        emailAddress: { type: 'string' },
        displayName: { type: 'string' },
        active: { type: 'boolean' },
      },
      required: ['self', 'accountId', 'emailAddress', 'displayName', 'active'],
    };

    userListSchema = {
      type: 'object',
      properties: {
        self: { type: 'string' },
        maxResults: { type: 'number' },
        startAt: { type: 'number' },
        total: { type: 'number' },
        isLast: { type: 'boolean' },
        values: {
          type: 'array',
          items: basicUserSchema,
        },
      },
      required: ['self', 'maxResults', 'startAt', 'total', 'isLast', 'values'],
    };

    // Create a new group if it doesn't already exist
    const searchResponse = await requestManager.send(
      'get',
      `groups/picker?query=${encodeURIComponent(groupName)}`,
      {},
      { Authorization: global.basicAuth },
    );

    const existingGroup = searchResponse.data.groups.find(
      (group) => group.name === groupName,
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
        { name: groupName },
      );
      createdGroupId = createResponse.data.groupId;
      logger.info(`Group created successfully with ID: ${createdGroupId}`);
    }

    // Add the user to the group
    const addUserResponse = await requestManager.send(
      'post',
      `group/user?groupId=${createdGroupId}`,
      {},
      { Authorization: global.basicAuth, 'Content-Type': 'application/json' },
      { accountId: accountIdToAdd },
    );

    if (addUserResponse.status === 201) {
      logger.info(`User ${accountIdToAdd} added to group ${createdGroupId}.`);
    } else {
      logger.error(
        `Failed to add user ${accountIdToAdd} to group ${createdGroupId}. Status: ${addUserResponse.status}`,
      );
    }
  });

  test('Verify adding a user to a specific group', async () => {
    logger.info(
      `Starting test to verify that adding a user to group with ID "${createdGroupId}" succeeds.`,
    );

    // Get the updated list of users in the group
    const response = await requestManager.send(
      'get',
      `group/member?groupId=${createdGroupId}`,
      {},
      { Authorization: global.basicAuth },
    );

    // Compara a resposta com o esquema
    const validationResult = validateSchema(response.data, userListSchema);
    if (validationResult.valid) {
      logger.info('-schemaValidator- Response matches schema.');
    } else {
      logger.error(
        '-schemaValidator- Response does not match schema. Validation errors:',
        validationResult.errors,
      );
    }

    // Check if the values property exists and if the added user is in the list
    if (response.data && response.data.values) {
      const userInGroup = response.data.values.some(
        (user) => user.accountId === accountIdToAdd,
      );

      if (userInGroup) {
        logger.info(
          `User ${accountIdToAdd} was successfully added to group ${createdGroupId}.`,
        );
      } else {
        logger.error(
          `User ${accountIdToAdd} was not found in group ${createdGroupId}.`,
        );
      }
    } else {
      logger.error('The API response does not contain the `values` array.');
    }
  });

  afterEach(async () => {
    if (createdGroupId) {
      logger.info('Starting group deletion.');

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
