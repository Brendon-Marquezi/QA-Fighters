const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);

const RequestManager = require('#utils/requestManager');

const requestManager = new RequestManager(env.environment.base_url);

let createdIssueId = '';

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`,
  ).toString('base64');

const jsonData = {
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
};

beforeEach(async () => {
  logger.info('Starting to create an issue');
  const issueResponse = await requestManager.send(
    'post',
    'issue',
    {},
    { Authorization: `${basicAuth}` },
    jsonData,
  );

  createdIssueId = issueResponse.data.id;
});

afterEach(async () => {
  logger.info('Starting issue selection check');
  if (createdIssueId) {
    await requestManager.send(
      'delete',
      `issue/${createdIssueId}`,
      {},
      { Authorization: `${basicAuth}` },
    );
  }
});

test('Check if you can edit an issue name', async () => {
  logger.info('Check if you can edit an issue name');
  const updateResponse = await requestManager.send(
    'put',
    `issue/${createdIssueId}`,
    {},
    { Authorization: `${basicAuth}` },
    {
      fields: {
        summary: 'Teste de edição de nome de uma issue',
      },
    },
  );

  expect(updateResponse.status).toBe(204);

  const issueResponse = await requestManager.send(
    'get',
    `issue/${createdIssueId}`,
    {},
    { Authorization: `${basicAuth}` },
  );

  expect(issueResponse.data.fields.summary).toBe(
    'Testing editing an issue name',
  );
});
