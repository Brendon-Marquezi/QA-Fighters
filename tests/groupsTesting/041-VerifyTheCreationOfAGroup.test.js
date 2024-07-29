const env = require('#configs/environments');
const logger = require('../../logger')(__filename);
const RequestManager = require('#utils/requestManager');

const requestManager = new RequestManager(env.environment.base_url);

let createdGroupId = '';

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`,
  ).toString('base64');

const groupNameToCreate = 'Group test 121';

test('Criação de um novo grupo', async () => {
  logger.info(`Iniciando teste de criação do grupo "${groupNameToCreate}".`);

  const response = await requestManager.send(
    'post',
    'group',
    {},
    { Authorization: basicAuth },
    {
      name: groupNameToCreate,
    },
  );

  logger.info(`Response: ${response.status} ${response.statusText}`);
  logger.info(
    `Grupo "${groupNameToCreate}" criado com sucesso. ID: ${response.data.id}`,
  );

  expect(response.status).toBe(201);
  expect(response.data).toBeDefined();
  expect(response.data.name).toBe(groupNameToCreate);

  createdGroupId = response.data.id;
});

afterAll(async () => {
  if (createdGroupId) {
    const deleteResponse = await requestManager.send(
      'delete',
      `group/${createdGroupId}`,
      {},
      { Authorization: basicAuth },
    );

    logger.info(`Deletando o grupo ${createdGroupId}.`);

    logger.info(
      `Deletando o grupo ${createdGroupId}. Status: ${deleteResponse.status}`,
    );
  }
});
