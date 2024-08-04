const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');

const requestManager = new RequestManager(env.environment.base_url);

let createdGroupId = '';

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`,
  ).toString('base64');

const jsonData = {
  name: env.environment.group_name,
};

beforeEach(async () => {
  logger.info('Checking if the group exists before creating a new one');

  // Check if the group already exists
  const existingGroupsResponse = await requestManager.send(
    'get',
    'groups/picker',
    { query: jsonData.name },
    { Authorization: basicAuth },
  );

  const existingGroups = existingGroupsResponse.data.groups;
  const existingGroup = existingGroups.find(
    (group) => group.name === jsonData.name,
  );

  if (existingGroup) {
    createdGroupId = existingGroup.groupId;
    logger.info(`Group already exists with ID: ${createdGroupId}`);
    // Optionally, delete the existing group to avoid conflicts
    await requestManager.send(
      'delete',
      `group`,
      { groupId: createdGroupId },
      { Authorization: basicAuth },
    );
    logger.info(`Existing group ${createdGroupId} deleted.`);
  } else {
    createdGroupId = '';
  }
});

test('Create and verify a new group', async () => {
  logger.info('Creating and verifying a new group');

  // Create the new group
  const createResponse = await requestManager.send(
    'post',
    'group',
    {},
    { Authorization: basicAuth },
    jsonData,
  );

  createdGroupId = createResponse.data.groupId;
  logger.info(`Group created successfully with ID: ${createdGroupId}`);

  // Verify the group was created
  const verifyResponse = await requestManager.send(
    'get',
    `group`,
    { groupId: createdGroupId },
    { Authorization: basicAuth },
  );

  if (verifyResponse.status === 200) {
    logger.info('Group verification passed.');
    if (verifyResponse.data.name === jsonData.name) {
      logger.info('Group name matches expected.');
    } else {
      logger.error('Group name does not match expected.');
    }
  } else {
    logger.error('Group verification failed. Status:', verifyResponse.status);
  }
});

afterEach(async () => {
  if (createdGroupId) {
    logger.info('Deleting the created group');

    // Delete the created group
    const deleteResponse = await requestManager.send(
      'delete',
      `group`,
      { groupId: createdGroupId },
      { Authorization: basicAuth },
    );

    if (deleteResponse.status === 200) {
      logger.info(`Group ${createdGroupId} deleted successfully.`);

      // Verify if the group was actually deleted by searching
      const searchResponse = await requestManager.send(
        'get',
        `groups/picker?query=${encodeURIComponent(jsonData.name)}`,
        {},
        { Authorization: basicAuth },
      );

      const remainingGroups = searchResponse.data.groups;
      const deletedGroup = remainingGroups.find(
        (group) => group.groupId === createdGroupId,
      );

      if (!deletedGroup) {
        logger.info(`Confirmation: Group ${createdGroupId} no longer exists.`);
      } else {
        logger.error(`Group ${createdGroupId} still exists.`);
      }
    } else {
      logger.error(
        `Failed to delete group ${createdGroupId}. Status: ${deleteResponse.status}`,
      );
    }
  } else {
    logger.error('No group ID available for deletion.');
  }
});
