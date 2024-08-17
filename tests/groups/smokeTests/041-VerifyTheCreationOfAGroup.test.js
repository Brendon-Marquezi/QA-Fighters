const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');
const validateSchema = require('#configs/schemaValidation');

describe('Groups', () => {
  let requestManager;
  let createdGroupId;
  let groupSchema;
  let groupName;

  beforeEach(async () => {
    logger.info('Checking if the group exists before creating a new one');
    requestManager = RequestManager.getInstance(env.environment.base_url);

    groupName = 'Teste1000';

    groupSchema = {
      type: 'object',
      properties: {
        groupId: { type: 'string' },
        name: { type: 'string' },
      },
      required: ['groupId', 'name'],
    };

    // Check if the group already exists
    const existingGroupsResponse = await requestManager.send(
      'get',
      'groups/picker',
      { query: groupName },
      { Authorization: global.basicAuth },
    );

    const existingGroups = existingGroupsResponse.data.groups;
    const existingGroup = existingGroups.find(
      (group) => group.name === groupName,
    );

    if (existingGroup) {
      createdGroupId = existingGroup.groupId;
      logger.info(`Group already exists with ID: ${createdGroupId}`);
      // Optionally, delete the existing group to avoid conflicts
      await requestManager.send(
        'delete',
        `group`,
        { groupId: createdGroupId },
        { Authorization: global.basicAuth },
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
      { Authorization: global.basicAuth },
      { name: groupName },
    );

    createdGroupId = createResponse.data.groupId;
    logger.info(`Group created successfully with ID: ${createdGroupId}`);

    // Verify the group was created
    const verifyResponse = await requestManager.send(
      'get',
      `group`,
      { groupId: createdGroupId },
      { Authorization: global.basicAuth },
    );

    if (verifyResponse.status === 200) {
      logger.info('Group verification passed.');
      if (verifyResponse.data.name === groupName) {
        logger.info('Group name matches expected.');
      } else {
        logger.error('Group name does not match expected.');
      }
    } else {
      logger.error('Group verification failed. Status:', verifyResponse.status);
    }

    // Verifies that the API response was successful
    if (verifyResponse.status === 200) {
      logger.info('-schemaValidator- Group verification passed.');

      // Compare the answer with the diagram
      const validation = validateSchema(verifyResponse.data, groupSchema);
      if (validation.valid) {
        logger.info('-schemaValidator- Response matches schema.');
      } else {
        logger.error(
          '-schemaValidator- Response does not match schema. Validation errors:',
          validation.errors,
        );
      }

      // Verify that the group name matches what is expected
      if (verifyResponse.data.name === groupName) {
        logger.info('-schemaValidator- Group name matches expected.');
      } else {
        logger.error('-schemaValidator- Group name does not match expected.');
      }
    } else {
      logger.error(
        '-schemaValidator- Group verification failed. Status:',
        verifyResponse.status,
      );
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
        { Authorization: global.basicAuth },
      );

      if (deleteResponse.status === 200) {
        logger.info(`Group ${createdGroupId} deleted successfully.`);

        // Verify if the group was actually deleted by searching
        const searchResponse = await requestManager.send(
          'get',
          `groups/picker?query=${encodeURIComponent(groupName)}`,
          {},
          { Authorization: global.basicAuth },
        );

        const remainingGroups = searchResponse.data.groups;
        const deletedGroup = remainingGroups.find(
          (group) => group.groupId === createdGroupId,
        );

        if (!deletedGroup) {
          logger.info(
            `Confirmation: Group ${createdGroupId} no longer exists.`,
          );
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
});
