const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');
const validateSchema = require('#configs/schemaValidation');

// Simplified schema for a user
const userSchema = {
  type: 'object',
  properties: {
    accountId: { type: 'string' },
    displayName: { type: 'string' },
    emailAddress: { type: 'string' },
    avatarUrls: {
      type: 'object',
      properties: {
        '48x48': { type: 'string' },
        '24x24': { type: 'string' },
        '16x16': { type: 'string' },
        '32x32': { type: 'string' }
      },
      required: ['48x48', '24x24', '16x16', '32x32']
    },
    active: { type: 'boolean' },
    timeZone: { type: 'string' },
    accountType: { type: 'string' }
  },
  required: ['accountId', 'displayName', 'emailAddress', 'avatarUrls', 'active', 'timeZone', 'accountType']
};

//Schema for the response containing a list of users
const userListSchema = {
  type: 'object',
  properties: {
    self: { type: 'string' },
    maxResults: { type: 'number' },
    startAt: { type: 'number' },
    total: { type: 'number' },
    isLast: { type: 'boolean' },
    values: {
      type: 'array',
      items: userSchema
    }
  },
  required: ['self', 'maxResults', 'startAt', 'total', 'isLast', 'values']
};

let requestManager;


const groupName = env.environment.group_name;
const accountIdToAdd = env.environment.client_id;
let createdGroupId = '';

beforeEach(async () => {
  logger.info('Starting group creation.');

  requestManager = RequestManager.getInstance(env.environment.base_url);

  // Create a new group if it doesn't already exist
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
    { Authorization: global.basicAuth, 'Content-Type': 'application/json' },
    { accountId: accountIdToAdd }
  );

  if (addUserResponse.status === 201) {
    logger.info(`User ${accountIdToAdd} added to group ${createdGroupId}.`);
  } else {
    logger.error(
      `Failed to add user ${accountIdToAdd} to group ${createdGroupId}. Status: ${addUserResponse.status}`
    );
  }
});

test('Verify adding a user to a specific group', async () => {
  logger.info(
    `Starting test to verify that adding a user to group with ID "${createdGroupId}" succeeds.`
  );

  // Get the updated list of users in the group
  const response = await requestManager.send(
    'get',
    `group/member?groupId=${createdGroupId}`,
    {},
    { Authorization: global.basicAuth }
  );

  // Log the response to understand its structure
  //console.log('Verify Group Response:', JSON.stringify(response.data, null, 2));

  // Validate the response schema
  const validationResult = validateSchema(response.data, userListSchema);
  if (!validationResult.valid) {
    logger.error(`Schema validation failed: ${validationResult.errors.map(e => e.message).join(', ')}`);
    throw new Error('Schema validation failed');
  }

  // Check if the values property exists and if the added user is in the list
  if (response.data && response.data.values) {
    const userInGroup = response.data.values.some(
      (user) => user.accountId === accountIdToAdd
    );

    if (userInGroup) {
      logger.info(
        `User ${accountIdToAdd} was successfully added to group ${createdGroupId}.`
      );
    } else {
      logger.error(
        `User ${accountIdToAdd} was not found in group ${createdGroupId}.`
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
      { Authorization: global.basicAuth }
    );

    if (deleteResponse.status === 200) {
      logger.info(`Group ${createdGroupId} deleted successfully.`);
    } else {
      logger.error(
        `Failed to delete group ${createdGroupId}. Status: ${deleteResponse.status}`
      );
    }
  } else {
    logger.error('No group ID available for deletion.');
  }
});
