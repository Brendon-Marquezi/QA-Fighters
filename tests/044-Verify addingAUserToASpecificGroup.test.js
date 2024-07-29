const env = require('#configs/environments');
const logger = require('../logger')(__filename);
const RequestManager = require('#utils/requestManager');

const requestManager = new RequestManager(env.environment.base_url);

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`,
  ).toString('base64');

const groupId = '6bd1e790-183e-426a-b1f6-619473672cba';
const accountIdToAdd = '712020:d15a1605-4430-4b91-a7b1-5c958b6ff0bc';

test('Verify not adding an already existing user to a specific group', async () => {
  logger.info(
    `Iniciando teste de não adição de um usuário já existente ao grupo com ID "${groupId}".`,
  );

  const response = requestManager.send(
    'post',
    `group/user?groupId=${groupId}`,
    {},
    {
      Authorization: basicAuth,
      'Content-Type': 'application/json',
    },
    {
      accountId: accountIdToAdd,
    },
  );

  await expect(response).rejects.toMatchObject({
    // Espero um erro de Bad Request
    response: {
      status: 400,
    },
  });
});
