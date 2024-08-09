const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);

const RequestManager = require('#utils/requestManager');

let requestManager;

let createdIssueId;

beforeEach(async () => {
  logger.info('Starting to create an issue');
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
  logger.info('Starting to delete an issue');
  requestManager = RequestManager.getInstance(env.environment.base_url);

  await requestManager.send(
    'delete',
    `issue/${createdIssueId}`,
    {},
    { Authorization: global.basicAuth },
  );
});

test("Check an issue's change log", async () => {
  logger.info('Check an issues change log');
  const endpoint = `issue/${createdIssueId}/changelog`;
  let response = await requestManager.send(
    'get',
    endpoint,
    {},
    { Authorization: global.basicAuth },
  );

  expect(response.status).toBe(200);

  expect(response.data).toHaveProperty('values');
});
