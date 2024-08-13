const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');

let requestManager;

let createdGroupId = '';
let createdProjectId = '';
let createdIssueId = '';
let commentId = '';

// 1. Criar um grupo
test('Create and verify a new group', async () => {
  logger.info('Creating and verifying a new group');

  requestManager = RequestManager.getInstance(env.environment.base_url);

  const jsonData = {
    name: env.environment.group_name,
  };

  const createResponse = await requestManager.send(
    'post',
    'group',
    {},
    { Authorization: global.basicAuth },
    jsonData,
  );

  logger.info('Create Group Response:', createResponse.data); // Log da resposta

  createdGroupId = createResponse.data.groupId;
  logger.info(`Group created successfully with ID: ${createdGroupId}`);

  const verifyResponse = await requestManager.send(
    'get',
    `group/${createdGroupId}`,
    {},
    { Authorization: global.basicAuth },
  );

  logger.info('Verify Group Response:', verifyResponse.data); // Log da resposta

  expect(verifyResponse.status).toBe(200);
  expect(verifyResponse.data.groupId).toBe(createdGroupId);
});

// 2. Adicionar o usuário ao grupo
test('Add user to the group', async () => {
  logger.info(`Adding user to the group with ID "${createdGroupId}"`);

  const jsonData = {
    userId: env.environment.userId, 
  };

  const response = await requestManager.send(
    'post',
    `group/${createdGroupId}/member`,
    {},
    { Authorization: global.basicAuth },
    jsonData,
  );

  logger.info('Add User Response:', response.data); // Log da resposta

  expect(response.status).toBe(200);
});

// 3. Criar um projeto
test('Create and verify a new project', async () => {
  logger.info('Creating and verifying a new project');

  const jsonData = {
    key: 'EXIT60',
    name: 'Example Project160',
    projectTypeKey: 'software',
    projectTemplateKey: 'com.pyxis.greenhopper.jira:gh-simplified-scrum-classic',
    description: 'This is an example project created using the Jira API.',
    assigneeType: 'PROJECT_LEAD',
    leadAccountId: env.environment.client_id,
  };

  const createResponse = await requestManager.send(
    'post',
    'project',
    {},
    { Authorization: global.basicAuth },
    jsonData,
  );

  logger.info('Create Project Response:', createResponse.data); // Log da resposta

  createdProjectId = createResponse.data.id;
  logger.info(`Project created successfully with ID: ${createdProjectId}`);

  const verifyResponse = await requestManager.send(
    'get',
    `project/${createdProjectId}`,
    {},
    { Authorization: global.basicAuth },
  );

  logger.info('Verify Project Response:', verifyResponse.data); // Log da resposta

  expect(verifyResponse.status).toBe(200);
  expect(verifyResponse.data.id).toBe(createdProjectId);
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
        id: '10012',
      },
    },
  };

  const issueResponse = await requestManager.send(
    'post',
    'issue',
    {},
    { Authorization: global.basicAuth },
    jsonData,
  );

  logger.info('Create Issue Response:', issueResponse.data); // Log da resposta

  createdIssueId = issueResponse.data.id;
  logger.info(`Issue created successfully with ID: ${createdIssueId}`);

  const verifyIssueResponse = await requestManager.send(
    'get',
    `issue/${createdIssueId}`,
    {},
    { Authorization: global.basicAuth },
  );

  logger.info('Verify Issue Response:', verifyIssueResponse.data); // Log da resposta

  expect(verifyIssueResponse.status).toBe(200);
  expect(verifyIssueResponse.data.id).toBe(createdIssueId);
});

// 5. Adicionar um comentário à Issue
test('Add a comment to the issue', async () => {
  logger.info('Adding a comment to the issue');

  const commentResponse = await requestManager.send(
    'post',
    `issue/${createdIssueId}/comment`,
    {},
    { Authorization: global.basicAuth },
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

  logger.info('Add Comment Response:', commentResponse.data); // Log da resposta

  expect(commentResponse.status).toBe(201);
  commentId = commentResponse.data.id; // Armazena o ID do comentário criado
});

// 6. Excluir o comentário da Issue
test('Delete the comment from the issue', async () => {
  logger.info('Deleting the comment from the issue');

  if (commentId) {
    const deleteResponse = await requestManager.send(
      'delete',
      `issue/${createdIssueId}/comment/${commentId}`,
      {},
      { Authorization: global.basicAuth },
    );

    logger.info('Delete Comment Response:', deleteResponse.data); // Log da resposta

    expect(deleteResponse.status).toBe(204);

    // Verificar se o comentário foi realmente excluído
    const getCommentsResponse = await requestManager.send(
      'get',
      `issue/${createdIssueId}/comment`,
      {},
      { Authorization: global.basicAuth },
    );

    logger.info('Get Comments Response:', getCommentsResponse.data); // Log da resposta

    const deletedComment = getCommentsResponse.data.comments.find(
      (comment) => comment.id === commentId
    );

    if (!deletedComment) {
      logger.info(`Confirmation: Comment ${commentId} no longer exists.`);
    } else {
      logger.error(`Comment ${commentId} still exists.`);
    }
  } else {
    logger.info('No comment ID available for deletion.');
  }
});

// Limpeza do sistema

// 7. Excluir a Issue
test('Delete the created issue', async () => {
  logger.info(`Deleting the created issue with ID: ${createdIssueId}`);

  if (createdIssueId) {
    const deleteIssueResponse = await requestManager.send(
      'delete',
      `issue/${createdIssueId}`,
      {},
      { Authorization: global.basicAuth },
    );

    logger.info('Delete Issue Response:', deleteIssueResponse.data); // Log da resposta

    expect(deleteIssueResponse.status).toBe(204);
    logger.info(`Issue ${createdIssueId} deleted successfully.`);
  } else {
    logger.info('No issue ID available for deletion.');
  }
});

// 8. Excluir o projeto
test('Delete the created project', async () => {
  logger.info(`Deleting the created project with ID: ${createdProjectId}`);

  if (createdProjectId) {
    const deleteProjectResponse = await requestManager.send(
      'delete',
      `project/${createdProjectId}`,
      {},
      { Authorization: global.basicAuth },
    );

    logger.info('Delete Project Response:', deleteProjectResponse.data); // Log da resposta

    expect(deleteProjectResponse.status).toBe(204);
    logger.info(`Project ${createdProjectId} deleted successfully.`);
  } else {
    logger.info('No project ID available for deletion.');
  }
});

// 9. Excluir o grupo
test('Delete the created group', async () => {
  logger.info(`Deleting the created group with ID: ${createdGroupId}`);

  if (createdGroupId) {
    const deleteGroupResponse = await requestManager.send(
      'delete',
      `group/${createdGroupId}`,
      {},
      { Authorization: global.basicAuth },
    );

    logger.info('Delete Group Response:', deleteGroupResponse.data); // Log da resposta

    expect(deleteGroupResponse.status).toBe(204);
    logger.info(`Group ${createdGroupId} deleted successfully.`);
  } else {
    logger.info('No group ID available for deletion.');
  }
});
