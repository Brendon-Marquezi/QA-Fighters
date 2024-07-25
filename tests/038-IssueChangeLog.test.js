require('dotenv').config();
const requestManager = require('../utils/requestManager');

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`,
  ).toString('base64');

test("Check an issue's change log", async () => {
  const issueIdOrKey = 'API-29';
  const endpoint = `issue/${issueIdOrKey}/changelog`;

  try {
    let response = await requestManager.send(
      'get',
      endpoint,
      {},
      { Authorization: `${basicAuth}` },
    );

    expect(response.status).toBe(200);

    expect(response.data).toHaveProperty('values');
  } catch (error) {
    console.error(
      'Erro ao obter log de alterações:',
      error.response ? error.response.data : error.message,
    );
  }
});

afterEach(async () => {
  const issueId = 'API-29';

  try {
    await requestManager.send(
      'delete',
      `issue/${issueId}`,
      {},
      { Authorization: `${basicAuth}` },
    );
  } catch (error) {
    console.error(
      'Erro ao excluir issue:',
      error.response ? error.response.data : error.message,
    );
  }
});
