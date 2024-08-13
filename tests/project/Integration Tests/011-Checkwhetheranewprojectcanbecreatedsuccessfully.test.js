const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');
const validateSchema = require('#configs/schemaValidation');

describe('Project', () => {
  let projectSchema;
  let jsonData;
  let requestManager;
  let createdProjectId;

  beforeEach(async () => {
     projectSchema = {
      type: 'object',
      properties: {
        id: { type: 'string' }, 
        key: { type: 'string' },
        name: { type: 'string' },
      },
      required: ['id', 'key', 'name'],
    };
    
    jsonData = {
      key: 'EXIT60',
      name: 'Example Project160',
      projectTypeKey: 'software',
      projectTemplateKey:
        'com.pyxis.greenhopper.jira:gh-simplified-scrum-classic',
      description: 'This is an example project created using the Jira API.',
      assigneeType: 'PROJECT_LEAD',
      leadAccountId: env.environment.client_id,
    };

    requestManager = RequestManager.getInstance(env.environment.base_url);
  });

  test('Create and verify a new project', async () => {
    logger.info('Creating and verifying a new project');

    // Create the new project
    const createResponse = await requestManager.send(
      'post',
      'project',
      {},
      { Authorization: global.basicAuth },
      jsonData,
    );

    createdProjectId = createResponse.data.id;
    logger.info(`Project created successfully with ID: ${createdProjectId}`);

    // Verify the project was created
    const verifyResponse = await requestManager.send(
      'get',
      `project/${createdProjectId}`,
      {},
      { Authorization: global.basicAuth },
    );

    // Check if the status is 200 OK
    expect(verifyResponse.status).toBe(200);

    if (verifyResponse.status === 200) {
      logger.info('Project verification passed.');
      
      /*
      // Log the received data and schema
      console.log('Received Data:', JSON.stringify(verifyResponse.data, null, 2));
      console.log('Expected Schema:', JSON.stringify(projectSchema, null, 2));
      */


      // Validate the schema of the response
      const validation = validateSchema(verifyResponse.data, projectSchema);

      if (validation.valid) {
        logger.info('-schemaValidator- Response matches schema.');
      } else {
        logger.error(
          '-schemaValidator- Response does not match schema. Validation errors:',
          validation.errors,
        );
      }

      // Validate that the project name matches expected
      if (verifyResponse.data.name === jsonData.name) {
        logger.info('Project name matches expected.');
      } else {
        logger.error('Project name does not match expected.');
      }
    } else {
      logger.error('Project verification failed. Status:', verifyResponse.status);
    }
  });

  afterEach(async () => {
    if (createdProjectId) {
      logger.info('Deleting the created project');

      const deleteResponse = await requestManager.send(
        'delete',
        `project/${createdProjectId}?enableUndo=false`,
        {},
        { Authorization: global.basicAuth },
      );

      if (deleteResponse.status === 204) {
        logger.info(`Project ${createdProjectId} deleted successfully.`);

        // Verify if the project was actually deleted by searching
        const searchResponse = await requestManager.send(
          'get',
          'project/search',
          {},
          { Authorization: global.basicAuth },
        );

        const remainingProjects = searchResponse.data.values;
        const deletedProject = remainingProjects.find(
          (project) => project.id === createdProjectId,
        );

        if (!deletedProject) {
          logger.info(`Confirmation: Project ${createdProjectId} no longer exists.`);
        } else {
          logger.error(`Project ${createdProjectId} still exists.`);
        }
      } else {
        logger.error(`Failed to delete project ${createdProjectId}. Status: ${deleteResponse.status}`);
      }
    } else {
      logger.info('No project ID available for deletion.');
    }
  });
});
