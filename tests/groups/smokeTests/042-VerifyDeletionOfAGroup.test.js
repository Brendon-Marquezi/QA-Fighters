const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');
const validateSchema = require('#configs/schemaValidation');

// Schema for creating and obtaining the group
const groupSchema = {
  type: 'object',
  properties: {
    groupId: { type: 'string' },
    name: { type: 'string' }
  },
  required: ['groupId', 'name']
};

// Schema for the response when listing the groups
const groupListSchema = {
  type: 'object',
  properties: {
    groups: {
      type: 'array',
      items: groupSchema
    }
  },
  required: ['groups']
};

let requestManager;

let createdGroupId = '';

const groupName = env.environment.group_name;

const jsonData = {
  name: groupName,
};

beforeEach(async () => {
  logger.info('Starting to create a group');
  
  requestManager = RequestManager.getInstance(env.environment.base_url);

  const groupResponse = await requestManager.send(
    'post',
    'group',
    {},
    { Authorization: global.basicAuth },
    jsonData,
  );

  // Validate the schema for the group creation response
  const groupValidationResult = validateSchema(groupResponse.data, groupSchema);
  if (!groupValidationResult.valid) {
    logger.error(`Schema validation failed for group creation: ${groupValidationResult.errors.map(e => e.message).join(', ')}`);
    throw new Error('Schema validation failed');
  }

  createdGroupId = groupResponse.data.groupId;
  logger.info(`Group created successfully with ID: ${createdGroupId}`);
});

test('Verify group creation and deletion', async () => {
  logger.info('Starting test for group creation and deletion');

  // Check if the group was created
  expect(createdGroupId).toBeDefined();

  // Verify the group was created
  const verifyResponse = await requestManager.send(
    'get',
    `group?groupId=${createdGroupId}`,
    {},
    { Authorization: global.basicAuth },
  );

  // Validate the schema for the group verification response
  const verifyValidationResult = validateSchema(verifyResponse.data, groupSchema);
  if (!verifyValidationResult.valid) {
    logger.error(`Schema validation failed for group verification: ${verifyValidationResult.errors.map(e => e.message).join(', ')}`);
    throw new Error('Schema validation failed');
  }

  expect(verifyResponse.status).toBe(200);
  expect(verifyResponse.data.name).toBe(jsonData.name);

  // Delete the group
  const deleteResponse = await requestManager.send(
    'delete',
    `group?groupId=${createdGroupId}`,
    {},
    { Authorization: global.basicAuth },
  );

  expect(deleteResponse.status).toBe(200);
  logger.info(`Group ${createdGroupId} deleted successfully.`);
});

afterEach(async () => {
  if (createdGroupId) {
    logger.info('Verifying group deletion');

    // Check if the group still exists by searching
    const getResponse = await requestManager.send(
      'get',
      `groups/picker?query=${encodeURIComponent(groupName)}`,
      {},
      { Authorization: global.basicAuth },
    );

    // Validate the schema for the group listing response
    const groupListValidationResult = validateSchema(getResponse.data, groupListSchema);
    if (!groupListValidationResult.valid) {
      logger.error(`Schema validation failed for group listing: ${groupListValidationResult.errors.map(e => e.message).join(', ')}`);
      throw new Error('Schema validation failed');
    }

    const groups = getResponse.data.groups;
    const groupExists = groups.some(
      (group) => group.groupId === createdGroupId,
    );
    
    if (!groupExists) {
      logger.info(`Confirmation: Group ${createdGroupId} no longer exists.`);
    } else {
      logger.error(`Group ${createdGroupId} still exists.`);
    }
  } else {
    logger.error('No group ID available for verification.');
  }
});
