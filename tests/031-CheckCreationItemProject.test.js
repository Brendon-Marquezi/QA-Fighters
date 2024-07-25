require('dotenv').config();

const requestManager = require('./../utils/requestManager');

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`,
  ).toString('base64');

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

let issueResponseId;

test('Check the creation of an item in a project', async () => {
  let response = await requestManager.send(
    'post',
    'issue',
    {},
    { Authorization: `${basicAuth}` },
    jsonData,
  );

  expect(response.status).toBe(201);
  expect(response.data).toHaveProperty('id');

  issueResponseId = response.data.id;

  expect(response.data).toHaveProperty('self');
  expect(response.data.self).toBe(
    `${process.env.JIRA_BASE_URL}issue/${issueResponseId}`,
  );
});

afterAll(async () => {
  if (issueResponseId) {
    await requestManager.send(
      'delete',
      `issue/${issueResponseId}`,
      {},
      { Authorization: `${basicAuth}` },
    );
  }
});
