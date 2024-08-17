const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');
const validateSchema = require('#configs/schemaValidation');

describe('Issues', () => {
  let getIssueResponseSchema;
  let createdIssueId;
  let requestManager;

  beforeEach(async () => {
    logger.info('Starting to create an issue');
    requestManager = RequestManager.getInstance(env.environment.base_url);

    getIssueResponseSchema = {
      type: 'object',
      properties: {
        fields: {
          type: 'object',
          properties: {
            summary: { type: 'string' },
          },
          required: ['summary'],
        },
      },
      required: ['fields'],
    };

    const issueResponse = await requestManager.send(
      'post',
      'issue',
      {},
      { Authorization: global.basicAuth },
      {
        fields: {
          project: {
            id: '10002',
          },
          summary: 'Issue for comment testing',
          description: {
            type: 'doc',
            version: 1,
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    text: 'Test issue description',
                    type: 'text',
                  },
                ],
              },
            ],
          },
          issuetype: {
            id: '10012',
          },
        },
      },
    );

    createdIssueId = issueResponse.data.id;
  });

  test('Check if you can edit an issue name', async () => {
    logger.info('Check if you can edit an issue name');

    const updateResponse = await requestManager.send(
      'put',
      `issue/${createdIssueId}`,
      {},
      { Authorization: global.basicAuth },
      {
        fields: {
          summary: 'Testing editing an issue name',
        },
      },
    );

    expect(updateResponse.status).toBe(204);

    const issueResponse = await requestManager.send(
      'get',
      `issue/${createdIssueId}`,
      {},
      { Authorization: global.basicAuth },
    );

    const validationResult = validateSchema(
      issueResponse.data,
      getIssueResponseSchema,
    );
    if (!validationResult.valid) {
      logger.error(
        `Schema validation failed: ${validationResult.errors.join(', ')}`,
      );
      throw new Error('Schema validation failed');
    }

    expect(issueResponse.data.fields.summary).toBe(
      'Testing editing an issue name',
    );
  });

  afterEach(async () => {
    logger.info('Starting issue selection check');

    if (createdIssueId) {
      await requestManager.send(
        'delete',
        `issue/${createdIssueId}`,
        {},
        { Authorization: global.basicAuth },
      );
    }
  });
});
