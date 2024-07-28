const env = require('../core/configs/environments');
const requestManager = require('../core/utils/requestManager');
const logger = require('./../logger')(__filename);

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`,
  ).toString('base64');

const groupNameToCreate = 'New group 33 ID: 041';

test('Criação de um novo grupo', async () => {
  logger.info(`Iniciando teste de criação do grupo "${groupNameToCreate}".`);

  try {
    const response = await requestManager.send(
      'post',
      'group', // Alteração aqui: utilize apenas 'group' como endpoint
      {}, // params
      {
        Authorization: basicAuth,
        'Content-Type': 'application/json',
      }, // headers
      {
        name: groupNameToCreate,
      }, // data
    );

    const createdGroup = response.data;

    // Verifica se a criação foi bem-sucedida
    expect(response.status).toBe(201); // Verifica se o status HTTP é 201 (Created)
    expect(createdGroup).toBeDefined();
    expect(createdGroup.name).toBe(groupNameToCreate);

    console.log(
      `Grupo "${groupNameToCreate}" criado com sucesso. ID: ${createdGroup.groupId}`,
    );

    logger.info(`Grupo "${groupNameToCreate}" criado com sucesso.`);
  } catch (error) {
    if (error.response) {
      // O servidor respondeu com um status fora do range de 2xx
      console.error(
        `Erro na criação do grupo "${groupNameToCreate}":`,
        error.response.status,
        error.response.data,
      );
    } else if (error.request) {
      // A requisição foi feita, mas não houve resposta do servidor
      console.error(
        `Erro na requisição para criar o grupo "${groupNameToCreate}":`,
        error.request,
      );
    } else {
      // Ocorreu um erro antes de enviar a requisição
      console.error(
        `Erro ao tentar criar o grupo "${groupNameToCreate}":`,
        error.message,
      );
    }
    throw error;
  }
});
