const env = require('#configs/environments');

const requestManager = require('#utils/requestManager');

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`,
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
  logger.info('Enviando requisição para criar um item no projeto ');
  try {
   let response = await requestManager.send(
       'post',
       'issue',
       {},
       {Authorization: `${basicAuth}`},
       jsonData,
   );
    logger.info('Requisição enviada com sucesso.');

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');

      issueResponseId = response.data.id;

      expect(response.data).toHaveProperty('self');
      expect(response.data.self).toBe(
          `${env.environment.base_url}issue/${issueResponseId}`,
      );
      
 }catch(error) {
      logger.error(`Erro ao enviar requisição: ${error.message}`);
      throw error;
  }
});

afterAll(async () => {
  logger.info(`Finalizando teste 031.`);
  if (issueResponseId) {
    await requestManager.send(
      'delete',
      `issue/${issueResponseId}`,
      {},
      { Authorization: `${basicAuth}` },
    );
  }
});
