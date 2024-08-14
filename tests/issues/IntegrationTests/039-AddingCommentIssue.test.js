const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');
const validateSchema = require('#configs/schemaValidation');

let requestManager;
let createdIssueId;

const commentSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    body: {
      type: 'object',
      properties: {
        type: { type: 'string' },
        version: { type: 'integer' },
        content: {
          type: 'array',
          items: { type: 'object' },
        },
      },
      required: ['type', 'version', 'content'],
    },
  },
  required: ['id', 'body'],
};

beforeEach(async () => {
  requestManager = RequestManager.getInstance(env.environment.base_url);
  logger.info('Sending a request to create an item in the project');
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
        summary: 'Issue para teste de comentário',
        description: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  text: 'Descrição do issue de teste',
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

afterEach(async () => {
  requestManager = RequestManager.getInstance(env.environment.base_url);
  logger.info('Starting the dilation check of an issue');
  if (createdIssueId) {
    await requestManager.send(
      'delete',
      `issue/${createdIssueId}`,
      {},
      { Authorization: global.basicAuth },
    );
  }
});

test('Check adding a comment to an issue', async () => {
  requestManager = RequestManager.getInstance(env.environment.base_url);
  logger.info('Check adding a comment to an issue');

  const commentBody = {
    type: 'doc',
    version: 1,
    content: [
      {
        type: 'paragraph',
        content: [
          {
            text: 'Teste de comentário de uma issue',
            type: 'text',
          },
        ],
      },
    ],
  };

  logger.info('Sending a request to add a comment', { commentBody });

  const commentResponse = await requestManager.send(
    'post',
    `issue/${createdIssueId}/comment`,
    {},
    { Authorization: global.basicAuth },
    { body: commentBody },
  );

  logger.info(`Response status for adding comment: ${commentResponse.status}`);
  logger.info('Comment response data:', commentResponse.data);

  expect(commentResponse.status).toBe(201);

  const validation = validateSchema(commentResponse.data, commentSchema);
  if (validation.valid) {
    logger.info('Schema validation passed for the comment response.');
  } else {
    logger.error('Schema validation failed. Validation errors:', validation.errors);
  }
});