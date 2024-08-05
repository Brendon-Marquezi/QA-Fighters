const requestManager = require('#utils/requestManager');
const env = require('#configs/environments');

const basicAuth = 
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`
  ).toString('base64');

test('Delete a user from Jira', async () => {
  const accountId = '712020:beb4ed28-5217-43cc-8afa-77f66b8d0d21'; // ID do usuário para exclusão
  const endpoint = `user?accountId=${accountId}`;

  const response = await requestManager.send(
    'delete',
    endpoint,
    {}, 
    { Authorization: basicAuth, Accept: 'application/json' } 
  );

  
  expect(response.status).toBe(204);

  // Verifique se a resposta não contém corpo
  expect(response.data).toBe(''); 
});
