const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');

let requestManager;

let issueResponseId;

const jsonData = {
  fields: {
    description: {
      content: [
        {
          content: [
            {
              text: 'Order entry fails when selecting supplier.',
              type: 'text',
            },
          ],
          type: 'paragraph',
        },
      ],
      type: 'doc',
      version: 1,
    },
    project: {
      id: '10002',
    },
    issuetype: {
      id: '10012',
    },
    summary: 'Teste de criação de um item no projeto ',
  },
  boards: [
    {
      id: '7',
    },
  ],
};



test('Check the creation of an item in a project', async () => {
  logger.info('Sending a request to create an item in the project.');

  requestManager = RequestManager.getInstance(env.environment.base_url);

  let response = await requestManager.send(
    'post',
    'issue',
    {},
    { Authorization: global.basicAuth },
    jsonData,
  );
  logger.info('Request sent successfully.');

  expect(response.status).toBe(201);
  expect(response.data).toHaveProperty('id');

  issueResponseId = response.data.id;

  expect(response.data).toHaveProperty('self');
  expect(response.data.self).toBe(
    `${env.environment.base_url}issue/${issueResponseId}`,
  );
});

afterEach(async () => {
  logger.info(`Finishing test 031.`);
  if (issueResponseId) {
    await requestManager.send(
      'delete',
      `issue/${issueResponseId}`,
      {},
      { Authorization: global.basicAuth },
    );
  }
});
