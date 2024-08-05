const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);

const RequestManager = require('#utils/requestManager');

const requestManager = new RequestManager(env.environment.base_url);

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`,
  ).toString('base64');

let createdIssueId;

beforeEach(async () => {
  logger.info('Sending a request to create an item in the project');
  const issueResponse = await requestManager.send(
    'post',
    'issue',
    {},
    { Authorization: `${basicAuth}` },
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
      { Authorization: `${basicAuth}` },
    );
  }
});

test('Check adding a comment to an issue', async () => {
  logger.info('Check adding a comment to an issue');
  const commentResponse = await requestManager.send(
    'post',
    `issue/${createdIssueId}/comment`,
    {},
    { Authorization: `${basicAuth}` },
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
