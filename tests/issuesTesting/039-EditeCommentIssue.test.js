const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);

const RequestManager = require('#utils/requestManager');

let requestManager;

let createdIssueId;

beforeEach(async () => {
  logger.info('Sending a request to create an item in the project');
  requestManager = RequestManager.getInstance(env.environment.base_url);

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
  logger.info('Check adding a comment to an issue');
  const commentResponse = await requestManager.send(
    'post',
    `issue/${createdIssueId}/comment`,
    {},
    { Authorization: global.basicAuth },
    {
      body: {
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
      },
    },
  );

  expect(commentResponse.status).toBe(201);
});
