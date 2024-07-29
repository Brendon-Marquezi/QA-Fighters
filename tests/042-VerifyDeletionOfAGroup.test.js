const env = require('#configs/environments');
const logger = require('../logger')(__filename);
const RequestManager = require('#utils/requestManager');

const requestManager = new RequestManager(env.environment.base_url);

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`,
  ).toString('base64');

//Use este ID = 7f04de8a-378e-45fa-b23d-8241eab4a691

const groupIdToDelete = '7f04de8a-378e-45fa-b23d-8241eab4a691';

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
