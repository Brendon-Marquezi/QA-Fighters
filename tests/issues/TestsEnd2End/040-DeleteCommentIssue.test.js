const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');

let requestManager;

let createdGroupId = '';
let createdProjectId = '';
let createdIssueId = '';
let commentId = '';

const accountIdToAdd = env.environment.client_id;
const groupName = env.environment.group_name;

const jsonDataProject = {
  key: 'EXIT67',
  name: 'Example Project167',
  projectTypeKey: 'software',
  projectTemplateKey: 'com.pyxis.greenhopper.jira:gh-simplified-scrum-classic',
  description: 'This is an example project created using the Jira API.',
  assigneeType: 'PROJECT_LEAD',
  leadAccountId: env.environment.client_id,
};

const jsonDataIssue = {
  fields: {
    description: {
      content: [
        {
          content: [
            {
              text: 'Order entry fails when selecting supplier.',
              type: 'text',
            },
          ],
          type: 'paragraph',
        },
      ],
      type: 'doc',
      version: 1,
    },
    project: {
      id: '', 
    },
    issuetype: {
      id: '10012',
    },
    summary: 'Teste de criação de um item no projeto 040 ',
  },
  boards: [
    {
      id: '7',
    },
  ],
};

// 1. Criar um grupo
test('Create and verify a new group', async () => {
  logger.info('Creating and verifying a new group');

  requestManager = RequestManager.getInstance(env.environment.base_url);

  const createResponse = await requestManager.send(
    'post',
    'group',
    {},
    { Authorization: global.basicAuth },
    { groupName: groupName },
  );

  createdGroupId = createResponse.data.groupId;
  logger.info(`Group created successfully with ID: ${createdGroupId}`);

  // Verificar se o grupo foi criado
  const verifyResponse = await requestManager.send(
    'get',
    `group`,
    { groupId: createdGroupId },
    { Authorization: global.basicAuth },
  );

  if (verifyResponse.status === 200) {
    logger.info('Group verification passed.');
    if (verifyResponse.data.name === jsonData.name) {
      logger.info('Group name matches expected.');
    } else {
      logger.error('Group name does not match expected.');
    }
  } else {
    logger.error('Group verification failed. Status:', verifyResponse.status);
  }
});

// 2. Adicionar o usuário ao grupo
test('Add user to the group', async () => {
  logger.info(`Adding user to the group with ID "${createdGroupId}"`);

  const addUserResponse = await requestManager.send(
    'post',
    `group/user?groupId=${createdGroupId}`,
    {},
    { Authorization: global.basicAuth, 'Content-Type': 'application/json' },
    { accountId: accountIdToAdd },
  );

  if (addUserResponse.status === 201) {
    logger.info(`User ${accountIdToAdd} added to group ${createdGroupId}.`);
  } else {
    logger.error(
      `Failed to add user ${accountIdToAdd} to group ${createdGroupId}. Status: ${addUserResponse.status}`
    );
  }
});

// 3. Criar um projeto
// Criação do projeto antes da issue
test('Create and verify a new project', async () => {
  logger.info('Creating and verifying a new project');

  const createResponse = await requestManager.send(
    'post',
    'project',
    {},
    { Authorization: global.basicAuth },
    jsonDataProject,
  );

  createdProjectId = createResponse.data.id;
  expect(createdProjectId).toBeDefined(); 

  logger.info(`Project created successfully with ID: ${createdProjectId}`);
});

// 4. Criar uma Issue somente após o projeto ter sido criado com sucesso
test('Create and verify an issue', async () => {
  logger.info('Creating and verifying an issue');

  if (createdProjectId) { 
    jsonDataIssue.fields.project.id = createdProjectId; 

    const issueResponse = await requestManager.send(
      'post',
      'issue',
      {},
      { Authorization: global.basicAuth },
      jsonDataIssue,
    );

    createdIssueId = issueResponse.data.id;
    logger.info(`Issue created successfully with ID: ${createdIssueId}`);

    const verifyIssueResponse = await requestManager.send(
      'get',
      `issue/${createdIssueId}`,
      {},
      { Authorization: global.basicAuth },
    );

    expect(verifyIssueResponse.status).toBe(200);
    expect(verifyIssueResponse.data.id).toBe(createdIssueId);
  } else {
    logger.error('Project ID is not available. Issue creation failed.');
  }
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

  logger.info('Add Comment Response:', commentResponse.data); 

  expect(commentResponse.status).toBe(201);
  commentId = commentResponse.data.id; // Armazena o ID do comentário criado
});

// 6. Excluir o comentário da Issue (Principal)
test('Delete the comment from the issue', async () => {
  logger.info('Deleting the comment from the issue');

  if (commentId) {
    const deleteResponse = await requestManager.send(
      'delete',
      `issue/${createdIssueId}/comment/${commentId}`,
      {},
      { Authorization: global.basicAuth },
    );

    logger.info('Delete Comment Response:', deleteResponse.data); 

    expect(deleteResponse.status).toBe(204);

    // Verificar se o comentário foi realmente excluído
    const getCommentsResponse = await requestManager.send(
      'get',
      `issue/${createdIssueId}/comment`,
      {},
      { Authorization: global.basicAuth },
    );

    logger.info('Get Comments Response:', getCommentsResponse.data); 

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

    logger.info('Delete Group Response:', deleteGroupResponse.data); 

    expect(deleteGroupResponse.status).toBe(204);
    logger.info(`Group ${createdGroupId} deleted successfully.`);
  } else {
    logger.info('No group ID available for deletion.');
  }
});
