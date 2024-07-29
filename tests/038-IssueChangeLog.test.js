const env = require('#configs/environments');
const logger = require('./../logger')(__filename);
<<<<<<< HEAD
const requestManager = require('#utils/requestManager');
=======
const RequestManager = require('#utils/requestManager');

const requestManager = new RequestManager(env.environment.base_url);
>>>>>>> main

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`,
  ).toString('base64');

let createdIssueId;

beforeEach(async () => {
  logger.info('Starting to create an issue');
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
  logger.info('Starting to delete an issue');
  await requestManager.send(
    'delete',
    `issue/${createdIssueId}`,
    {},
    { Authorization: `${basicAuth}` },
  );
});

test("Check an issue's change log", async () => {
  logger.info('Check an issues change log');
  const endpoint = `issue/${createdIssueId}/changelog`;
  let response = await requestManager.send(
    'get',
    endpoint,
    {},
    { Authorization: `${basicAuth}` },
  );

  expect(response.status).toBe(200);

  expect(response.data).toHaveProperty('values');
});
