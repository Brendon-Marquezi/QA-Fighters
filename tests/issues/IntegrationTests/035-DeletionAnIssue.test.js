const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');

let createdIssueId = '';
let requestManager;

const jsonData = {
  fields: {
    project: {
      id: '10002',
    },
    summary: 'Issue para teste de exclusão',
    description: {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Descrição do issue de teste para exclusão',
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
  requestManager = RequestManager.getInstance(env.environment.base_url);
  logger.info('Starting to create an issue');
  const issueResponse = await requestManager.send(
    'post',
    'issue',
    {},
    {Authorization: global.basicAuth},
    jsonData,
  );

  createdIssueId = issueResponse.data.id;
});

test('Check deletion of an issue from a project', async () => {
  requestManager = RequestManager.getInstance(env.environment.base_url);
  logger.info('Check deletion of an issue from a project');
  const deleteResponse = await requestManager.send(
    'delete',
    `issue/${createdIssueId}`,
    {},
    {Authorization: global.basicAuth },
  );

  logger.info('Starting issue selection check');
  expect(deleteResponse.status).toBe(204);
});
