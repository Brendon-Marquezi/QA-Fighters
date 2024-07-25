require('dotenv').config();
const requestManager = require('./../utils/requestManager');
const basicAuth =
  'Basic ' +
  Buffer.from(
    `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`,
  ).toString('base64');
let createdIssueId;

beforeEach(async () => {
  try {
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
  } catch (error) {
    console.error(
      'Erro ao criar issue:',
      error.response ? error.response.data : error.message,
    );
  }
});

afterEach(async () => {
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
  try {
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
      'Teste de edição de nome de uma issue',
    );
  } catch (error) {
    console.error(
      'Erro ao atualizar issue:',
      error.response ? error.response.data : error.message,
    );
  }
});
