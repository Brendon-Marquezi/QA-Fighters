const env = require('#configs/environments');
const logger = require('../../core/utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');

const requestManager = new RequestManager(env.environment.base_url);

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`,
  ).toString('base64');

// Context variables
const groupName = env.environment.group_name;
const userIdToAdd = env.environment.client_id;
let createdGroupId = '';

beforeEach(async () => {
  logger.info('Starting group verification and creation.');

  // Check if the group already exists
  const searchResponse = await requestManager.send(
    'get',
    `groups/picker?query=${encodeURIComponent(groupName)}`,
    {},
    { Authorization: basicAuth },
  );

  const existingGroup = searchResponse.data.groups.find(
    (group) => group.name === groupName,
  );

  if (existingGroup) {
    createdGroupId = existingGroup.groupId;
    logger.info(`Existing group found with ID: ${createdGroupId}`);
  } else {
    // Create a new group if it does not exist
    const createResponse = await requestManager.send(
      'post',
      'group',
      {},
      { Authorization: basicAuth },
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
    { Authorization: basicAuth },
    { accountId: userIdToAdd },
  );

  if (addUserResponse.status === 201) {
    logger.info(`User ${userIdToAdd} added to group ${createdGroupId}.`);
  } else {
    logger.error(
      `Failed to add user ${userIdToAdd} to group ${createdGroupId}. Status: ${addUserResponse.status}`,
    );
  }
});

test('Verify users belonging to a specific group', async () => {
  logger.info(
    `Starting test to verify users of the group with ID "${createdGroupId}".`,
  );

  const response = await requestManager.send(
    'get',
    `group/member?groupId=${createdGroupId}`,
    {},
    { Authorization: basicAuth },
  );

  logger.info(`Response: ${response.status} ${response.statusText}`);

  // Check if the `values` property exists
  if (response.data && response.data.values) {
    logger.info(`Listing users of group "${createdGroupId}":`);
    response.data.values.forEach((member) => {
      logger.info(
        `- User ID: ${member.accountId}, Name: ${member.displayName}`,
      );
    });

    if (response.status === 200 && response.data.values.length > 0) {
      logger.info('Test passed: users were successfully listed.');
    } else {
      logger.error(
        'Test failed: the response does not contain users or failed to list.',
      );
    }
  } else {
    logger.error(`The API response does not contain the 'values' property.`);
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
      { Authorization: basicAuth },
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
