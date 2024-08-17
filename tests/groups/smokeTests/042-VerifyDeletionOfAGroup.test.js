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
    logger.info('Starting to create a group');
    requestManager = RequestManager.getInstance(env.environment.base_url);

    groupName = 'teste103';

    groupSchema = {
      type: 'object',
      properties: {
        groupId: { type: 'string' },
        name: { type: 'string' },
        self: { type: 'string' },
        users: {
          type: 'object',
          properties: {
            size: { type: 'integer' },
            items: {
              type: 'array',
              items: {},
            },
            'max-results': { type: 'integer' },
            'start-index': { type: 'integer' },
            'end-index': { type: 'integer' },
          },
          required: [
            'size',
            'items',
            'max-results',
            'start-index',
            'end-index',
          ],
        },
        expand: { type: 'string' },
      },
      required: ['groupId', 'name', 'self', 'users'],
    };

    const groupResponse = await requestManager.send(
      'post',
      'group',
      {},
      { Authorization: global.basicAuth },
      { name: groupName },
    );

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

    const verifyValidationResult = validateSchema(
      verifyResponse.data,
      groupSchema,
    );
    if (verifyValidationResult.valid) {
      logger.info('-schemaValidator- Response matches schema.');
    } else {
      logger.error(
        '-schemaValidator- Response does not match schema. Validation errors:',
        verifyValidationResult.errors,
      );
    }

    expect(verifyResponse.status).toBe(200);
    expect(verifyResponse.data.name).toBe(groupName);

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
});
