const requestManager = require('#utils/requestManager');
const env = require('#configs/environments').environment;

const basicAuth = 'Basic ' + Buffer.from(
  `${env.username}:${env.api_token}`
).toString('base64');

// Substitua pelo accountId do usuário que você deseja deletar
const accountId = '712020:7b833a06-0569-423a-9c9c-1a0075cfb6e3';

test('Delete a user', async () => {
  console.log('Iniciando o teste de deleção de usuário'); // Log para depuração
  try {
    const response = await requestManager.send(
      'delete',
      `user?accountId=${accountId}`,
      {},
      { Authorization: basicAuth }
    );

    // Verifique se a resposta tem o status 204, que indica sucesso
    expect(response.status).toBe(204);
  } catch (error) {
    console.error(
      'Erro ao deletar usuário:',
      error.response ? error.response.data : error.message
    );
  }
});
