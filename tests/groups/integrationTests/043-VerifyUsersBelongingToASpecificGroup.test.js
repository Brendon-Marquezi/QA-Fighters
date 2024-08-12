const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');
const validateSchema = require('#configs/schemaValidation');

// Simplified schema for a user
const userSchema = {
  type: 'object',
  properties: {
    accountId: { type: 'string' },
    displayName: { type: 'string' }
  },
  required: ['accountId', 'displayName']
};

// Schema for the response containing a list of users
const userListSchema = {
  type: 'object',
  properties: {
    values: {
      type: 'array',
      items: userSchema
    }
  },
  required: ['values']
};

let requestManager;


const groupName = env.environment.group_name;
const userIdToAdd = env.environment.client_id;
let createdGroupId = '';

beforeEach(async () => {
  logger.info('Starting group verification and creation.');
  requestManager = RequestManager.getInstance(env.environment.base_url);

  // Check if the group already exists
  const searchResponse = await requestManager.send(
    'get',
    `groups/picker?query=${encodeURIComponent(groupName)}`,
    {},
    { Authorization: global.basicAuth }
  );

  const existingGroup = searchResponse.data.groups.find(
    (group) => group.name === groupName
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
      { Authorization: global.basicAuth },
      { name: groupName }
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
    { accountId: userIdToAdd }
  );

  if (addUserResponse.status === 201) {
    logger.info(`User ${userIdToAdd} added to group ${createdGroupId}.`);
  } else {
    logger.error(
      `Failed to add user ${userIdToAdd} to group ${createdGroupId}. Status: ${addUserResponse.status}`
    );
  }
});

test('Verify users belonging to a specific group', async () => {
  logger.info(`Starting test to verify users of the group with ID "${createdGroupId}".`);

  const response = await requestManager.send(
    'get',
    `group/member?groupId=${createdGroupId}`,
    {},
    { Authorization: global.basicAuth }
  );

  logger.info(`Response: ${response.status} ${response.statusText}`);

  // Validate the response schema
  const validationResult = validateSchema(response.data, userListSchema);
  if (!validationResult.valid) {
    logger.error(`Schema validation failed: ${validationResult.errors.join(', ')}`);
    throw new Error('Schema validation failed');
  }

  // Check if the values property exists
  if (response.data && response.data.values) {
    logger.info(`Listing users of group "${createdGroupId}":`);
    response.data.values.forEach((member) => {
      logger.info(`- User ID: ${member.accountId}, Name: ${member.displayName}`);
    });

    if (response.status === 200 && response.data.values.length > 0) {
      logger.info('Test passed: users were successfully listed.');
    } else {
      logger.error('Test failed: the response does not contain users or failed to list.');
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
      { Authorization: global.basicAuth }
    );

    if (deleteResponse.status === 200) {
      logger.info(`Group ${createdGroupId} deleted successfully.`);
      
      // Verify if the group is deleted
      const searchResponse = await requestManager.send(
        'get',
        `groups/picker?query=${encodeURIComponent(groupName)}`,
        {},
        { Authorization: global.basicAuth }
      );

      const deletedGroup = searchResponse.data.groups.find(
        (group) => group.groupId === createdGroupId
      );

      if (!deletedGroup) {
        logger.info(`Verified: Group ${createdGroupId} is successfully deleted.`);
      } else {
        logger.error(`Verification failed: Group ${createdGroupId} still exists.`);
      }

    } else {
      logger.error(
        `Failed to delete group ${createdGroupId}. Status: ${deleteResponse.status}`
      );
    }
  } else {
    logger.error('No group ID available for deletion.');
  }
});
