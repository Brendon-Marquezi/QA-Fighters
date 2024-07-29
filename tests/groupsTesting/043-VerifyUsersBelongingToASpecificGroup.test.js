const env = require('#configs/environments');
const logger = require('../../logger')(__filename);
const RequestManager = require('#utils/requestManager');

const requestManager = new RequestManager(env.environment.base_url);

//Group: New group 312 ID: 04

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`,
  ).toString('base64');

const groupId = '56c22a1c-2cf5-4147-9235-1e964e13d4cf';

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
  expect(response.data.group).toBeDefined();
  expect(response.data.group.length).toBeGreaterThan(0);
});
