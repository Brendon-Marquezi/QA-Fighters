const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');

const requestManager = new RequestManager(env.environment.base_url);

const basicAuth =
  'Basic ' +
  Buffer.from(
    `${env.environment.username}:${env.environment.api_token}`,
  ).toString('base64');

let createdGroupId = '';
let createdIssueId = '';
let createdProjectId = '';

// 1. Criar um grupo
test('Create and verify a new group', async () => {
  logger.info('Creating and verifying a new group');

  const jsonData = {
    name: env.environment.group_name,
  };

  const createResponse = await requestManager.send(
    'post',
    'group',
    {},
    { Authorization: basicAuth },
    jsonData,
  );

  createdGroupId = createResponse.data.groupId;
  logger.info(`Group created successfully with ID: ${createdGroupId}`);

  const verifyResponse = await requestManager.send(
    'get',
    `group/${createdGroupId}`,
    {},
    { Authorization: basicAuth },
  );

  expect(verifyResponse.statusCode).toBe(200);
  expect(verifyResponse.data.groupId).toBe(createdGroupId);
});

// 2. Adicionar o usuário ao grupo
test('Add user to the group', async () => {
  logger.info(`Adding user to the group with ID "${createdGroupId}"`);

  const jsonData = {
    userId: env.environment.userId, // Substitua com o ID real do usuário
  };

  const response = await requestManager.send(
    'post',
    `group/${createdGroupId}/member`,
    {},
    { Authorization: basicAuth },
    jsonData,
  );

  expect(response.statusCode).toBe(200);
});

// 3. Criar um projeto
test('Create and verify a new project', async () => {
  logger.info('Creating and verifying a new project');

  const projectData = {
    key: 'TESTE02',
    name: 'Example09',
    projectTemplateKey:
      'com.pyxis.greenhopper.jira:gh-simplified-scrum-classic',
    leadAccountId: env.environment.leadAccountId,
  };

  const projectResponse = await requestManager.send(
    'post',
    'project',
    {},
    { Authorization: basicAuth },
    projectData,
  );

  createdProjectId = projectResponse.data.id;
  logger.info(`Project created successfully with ID: ${createdProjectId}`);

  // Verify the project was created
  const verifyProjectResponse = await requestManager.send(
    'get',
    `project/${createdProjectId}`,
    {},
    { Authorization: basicAuth },
  );

  expect(verifyProjectResponse.statusCode).toBe(200);
  expect(verifyProjectResponse.data.id).toBe(createdProjectId);
});

// 4. Criar uma Issue
test('Create and verify an issue', async () => {
  logger.info('Creating and verifying an issue');

  const jsonData = {
    fields: {
      project: {
        id: createdProjectId, // Usa o ID do projeto criado
      },
      summary: 'Issue para teste de exclusão',
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                text: 'Descrição do issue de teste para exclusão',
                type: 'text',
              },
            ],
          },
        ],
      },
      issuetype: {
        id: '10012', // Substitua com o ID real do tipo de issue
      },
    },
  };

  const issueResponse = await requestManager.send(
    'post',
    'issue',
    {},
    { Authorization: basicAuth },
    jsonData,
  );

  createdIssueId = issueResponse.data.id;
  logger.info(`Issue created successfully with ID: ${createdIssueId}`);

  // Verify the issue was created
  const verifyIssueResponse = await requestManager.send(
    'get',
    `issue/${createdIssueId}`,
    {},
    { Authorization: basicAuth },
  );

  expect(verifyIssueResponse.statusCode).toBe(200);
  expect(verifyIssueResponse.data.id).toBe(createdIssueId);
});

// 5. Adicionar um comentário à Issue
test('Add a comment to the issue', async () => {
  logger.info('Adding a comment to the issue');

  const commentResponse = await requestManager.send(
    'post',
    `issue/${createdIssueId}/comment`,
    {},
    { Authorization: basicAuth },
    {
      body: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                text: 'Teste de comentário de uma issue',
                type: 'text',
              },
            ],
          },
        ],
      },
    },
  );

  expect(commentResponse.statusCode).toBe(201);
});

// 6. Excluir o comentário da Issue
afterEach(async () => {
  logger.info('Deleting the issue');

  if (createdIssueId) {
    const deleteResponse = await requestManager.send(
      'delete',
      `issue/${createdIssueId}`,
      {},
      { Authorization: basicAuth },
    );

    // eslint-disable-next-line jest/no-standalone-expect
    expect(deleteResponse.statusCode).toBe(204); // Status code para exclusão bem-sucedida
  }
});
