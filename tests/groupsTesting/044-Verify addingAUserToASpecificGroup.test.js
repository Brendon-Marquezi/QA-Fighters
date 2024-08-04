const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');

const requestManager = new RequestManager(env.environment.base_url);

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`,
  ).toString('base64');

// Use context variables
const groupName = env.environment.group_name;
const accountIdToAdd = env.environment.client_id;
let createdGroupId = '';

beforeEach(async () => {
  logger.info('Starting group creation.');

  // Create a new group if it doesn't already exist
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
    { Authorization: basicAuth, 'Content-Type': 'application/json' },
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

test('Verify not adding an already existing user to a specific group', async () => {
  logger.info(
    `Starting test to verify that adding an already existing user to group with ID "${createdGroupId}" fails.`,
  );

  // Attempt to add the same user again
  const response = requestManager.send(
    'post',
    `group/user?groupId=${createdGroupId}`,
    {},
    { Authorization: basicAuth, 'Content-Type': 'application/json' },
    { accountId: accountIdToAdd },
  );

  await expect(response).rejects.toMatchObject({
    response: {
      status: 400,
    },
  });
});

afterEach(async () => {
  if (createdGroupId) {
    logger.info('Starting user verification and group deletion.');

    // Verify if the user was added
    const verifyResponse = await requestManager.send(
      'get',
      `group/member?groupId=${createdGroupId}`,
      {},
      { Authorization: basicAuth },
    );

    if (verifyResponse.data && verifyResponse.data.values) {
      const userInGroup = verifyResponse.data.values.some(
        (member) => member.accountId === accountIdToAdd,
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
      logger.error('The API response does not contain the `values` property.');
    }

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
