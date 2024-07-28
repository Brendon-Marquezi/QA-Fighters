const env = require('#configs/environments');
const logger = require('./../logger')(__filename);
const requestManager = require('#utils/requestManager');

//Group: New group 312 ID: 04

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`,
  ).toString('base64');

const groupId = '6bd1e790-183e-426a-b1f6-619473672cba';

test('Verificar usuários pertencentes a um grupo específico', async () => {
  logger.info(
    `Iniciando teste de verificação de usuários do grupo com ID "${groupId}".`,
  );

  const response = await requestManager.send(
    'get',
    `group/member?groupId=${groupId}`,
    {},
    { Authorization: basicAuth },
  );

  logger.info(`Response: ${response.status} ${response.statusText}`);
  logger.info(`Listagem de usuários do grupo "${groupId}":`);
  response.data.groups.forEach((group) => {
    logger.info(`- Grupo ID: ${group.groupId}, Nome: ${group.name}`);
  });

  expect(response.status).toBe(200);
  expect(response.data.groups).toBeDefined();
  expect(response.data.groups.length).toBeGreaterThan(0);
});
