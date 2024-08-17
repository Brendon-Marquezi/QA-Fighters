const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');
const validateSchema = require('#configs/schemaValidation');

describe('Groups', () => {
  let requestManager;
  let createdGroupId;
  let groupName;
  let userIdToAdd;
  let groupSchema;

  beforeEach(async () => {
    requestManager = RequestManager.getInstance(env.environment.base_url);

    userIdToAdd = env.environment.client_id;

    groupName = 'teste701';

    groupSchema = {
      type: 'object',
      properties: {
        header: { type: 'string' },
        total: { type: 'integer' },
        groups: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              html: { type: 'string' },
              labels: {
                type: 'array',
                items: { type: 'string' },
              },
              groupId: { type: 'string' },
            },
            required: ['name', 'html', 'groupId'],
          },
        },
      },
      required: ['header', 'total', 'groups'],
    };
  });

  test('Verify existing groups through a search', async () => {
    logger.info('Starting group creation and user addition.');

    // Group search
    const searchResponseGroup = await requestManager.send(
      'get',
      `groups/picker?query=${encodeURIComponent(env.environment.group_name)}`,
      {},
      { Authorization: global.basicAuth },
    );

    const existingGroup = searchResponseGroup.data.groups.find(
      (group) => group.name === env.environment.group_name,
    );

    if (existingGroup) {
      createdGroupId = existingGroup.groupId;
      logger.info(`Existing group found with ID: ${createdGroupId}`);
    } else {
      // Create new group if not found
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
      { accountId: userIdToAdd },
    );

    if (addUserResponse.status === 201) {
      logger.info(`User ${userIdToAdd} added to group ${createdGroupId}.`);
    } else {
      logger.error(
        `Failed to add user ${userIdToAdd} to group ${createdGroupId}. Status: ${addUserResponse.status}`,
      );
    }

    logger.info('Starting test to verify group search.');

    // Execute the search query
    const searchResponse = await requestManager.send(
      'get',
      `groups/picker?query=${encodeURIComponent(groupName)}`,
      {},
      { Authorization: global.basicAuth },
    );

    expect(searchResponse.status).toBe(200);

    // Log the response
    logger.info(
      `Response: ${searchResponse.status} ${searchResponse.statusText}`,
    );
    logger.info(
      'Search Response:',
      JSON.stringify(searchResponse.data, null, 2),
    );

    // Validate response schema
    const validation = validateSchema(searchResponse.data, groupSchema);
    if (validation.valid) {
      logger.info('-schemaValidator- Response matches schema.');
    } else {
      logger.error(
        '-schemaValidator- Response does not match schema. Validation errors:',
        validation.errors,
      );
    }

    // Check if the group is present in the response
    const foundGroup = searchResponse.data.groups.find(
      (group) => group.name === groupName,
    );

    expect(foundGroup).toBeDefined();
    expect(foundGroup.name).toContain(env.environment.group_name);
  }, 10000);

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
