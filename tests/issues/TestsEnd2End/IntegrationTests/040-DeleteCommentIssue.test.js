const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');

describe('Issues', () => {
  let requestManager;
  let createdGroupId;
  let createdProjectId;
  let createdIssueId;
  let commentId;
  let jsonDataProject;
  let jsonDataIssue;
  let accountIdToAdd;
  let groupName;

  beforeEach(() => {
    requestManager = RequestManager.getInstance(env.environment.base_url);

    accountIdToAdd = env.environment.client_id;
    groupName = env.environment.group_name;

    jsonDataProject = {
      key: 'EXIT46901',
      name: 'Example Project124690',
      projectTypeKey: 'software',
      projectTemplateKey:
        'com.pyxis.greenhopper.jira:gh-simplified-scrum-classic',
      description: 'This is an example project created using the Jira API.',
      assigneeType: 'PROJECT_LEAD',
      leadAccountId: env.environment.client_id,
    };

    jsonDataIssue = {
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
          id: createdProjectId,
        },
        issuetype: {
          id: '10000',
        },
        summary: 'Teste de criação de um item no projeto ',
      },
      boards: [
        {
          id: '7',
        },
      ],
    };
  });

  test('Delete the comment from the issue', async () => {
    logger.info('Creating and verifying a new group');

    const createResponse = await requestManager.send(
      'post',
      'group',
      {},
      { Authorization: global.basicAuth },
      { name: groupName },
    );

    createdGroupId = createResponse.data.groupId;
    logger.info(`Group created successfully with ID: ${createdGroupId}`);

    // Verify the group was created
    const verifyResponse = await requestManager.send(
      'get',
      `group?groupId=${createdGroupId}`,
      {},
      { Authorization: global.basicAuth },
    );

    if (verifyResponse.status === 200) {
      logger.info('Group verification passed.');
      if (verifyResponse.data.name === groupName) {
        logger.info('Group name matches expected.');
      } else {
        logger.error('Group name does not match expected.');
      }
    } else {
      logger.error('Group verification failed. Status:', verifyResponse.status);
    }

    // Add user to group
    logger.info('Add user to the group');
    logger.info(`Adding user to the group with ID "${createdGroupId}"`);

    const addUserResponse = await requestManager.send(
      'post',
      `group/user?groupId=${createdGroupId}`,
      {},
      { Authorization: global.basicAuth },
      { accountId: accountIdToAdd },
    );

    if (addUserResponse.status === 201) {
      logger.info(`User ${accountIdToAdd} added to group ${createdGroupId}.`);
    } else {
      logger.error(
        `Failed to add user ${accountIdToAdd} to group ${createdGroupId}. Status: ${addUserResponse.status}`,
      );
    }

    // Create and verify the new project
    logger.info('Creating and verifying a new project');

    const createResponseProject = await requestManager.send(
      'post',
      'project',
      {},
      { Authorization: global.basicAuth },
      jsonDataProject,
    );

    createdProjectId = createResponseProject.data.id;

    logger.info(`Project created successfully with ID: ${createdProjectId}`);

    // Create an Issue only after the project has been successfully created
    logger.info('Creating and verifying an issue');

    if (createdProjectId != undefined) {
      // Make sure the project ID is available
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

    // Add a comment to the Issue
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
    commentId = commentResponse.data.id;

    // Delete Issue Comment
    logger.info('Deleting the comment from the issue');

    if (commentId != undefined) {
      const deleteResponse = await requestManager.send(
        'delete',
        `issue/${createdIssueId}/comment/${commentId}`,
        {},
        { Authorization: global.basicAuth },
      );

      logger.info('Delete Comment Response:', deleteResponse.data);

      expect(deleteResponse.status).toBe(204);

      // Check if the comment was actually deleted
      const getCommentsResponse = await requestManager.send(
        'get',
        `issue/${createdIssueId}/comment`,
        {},
        { Authorization: global.basicAuth },
      );

      logger.info('Get Comments Response:', getCommentsResponse.data);

      const deletedComment = getCommentsResponse.data.comments.find(
        (comment) => comment.id === commentId,
      );

      if (!deletedComment) {
        logger.info(`Confirmation: Comment ${commentId} no longer exists.`);
      } else {
        logger.error(`Comment ${commentId} still exists.`);
      }
    } else {
      logger.info('No comment ID available for deletion.');
    }
  }, 10000);

  afterEach(async () => {
    // Delete the project
    logger.info('Delete the created project');
    logger.info(`Deleting the created project with ID: ${createdProjectId}`);

    if (createdProjectId != undefined) {
      const deleteProjectResponse = await requestManager.send(
        'delete',
        `project/${createdProjectId}?enableUndo=false`,
        {},
        { Authorization: global.basicAuth },
      );

      logger.info('Delete Project Response:', deleteProjectResponse.data);

      expect(deleteProjectResponse.status).toBe(204);
      logger.info(`Project ${createdProjectId} deleted successfully.`);
    } else {
      logger.info('No project ID available for deletion.');
    }

    // Delete the group
    logger.info('Delete the created group');
    logger.info(`Deleting the created group with ID: ${createdGroupId}`);

    if (createdGroupId != undefined) {
      const deleteGroupResponse = await requestManager.send(
        'delete',
        `group?groupId=${createdGroupId}`,
        {},
        { Authorization: global.basicAuth },
      );

      logger.info('Delete Group Response:', deleteGroupResponse.data);

      expect(deleteGroupResponse.status).toBe(200);
      logger.info(`Group ${createdGroupId} deleted successfully.`);
    } else {
      logger.info('No group ID available for deletion.');
    }
  });
});