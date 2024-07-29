const env = require('#configs/environments');
const logger = require('../logger')(__filename);
const requestManager = require('#utils/requestManager');

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`,
  ).toString('base64');

const groupIdToDelete = '5a590bd3-2273-4b95-ab2f-114628e6e9a4';

test('Deletar um grupo específico', async () => {
  logger.info(
    `Iniciando teste de deleção do grupo com ID "${groupIdToDelete}".`,
  );

  const deleteResponse = await requestManager.send(
    'delete',
    `group?groupId=${groupIdToDelete}`,
    {},
    { Authorization: basicAuth },
  );

  logger.info(
    `Response: ${deleteResponse.status} ${deleteResponse.statusText}`,
  );
  logger.info(`Grupo com ID "${groupIdToDelete}" deletado com sucesso.`);

  expect(deleteResponse.status).toBe(200);
});
