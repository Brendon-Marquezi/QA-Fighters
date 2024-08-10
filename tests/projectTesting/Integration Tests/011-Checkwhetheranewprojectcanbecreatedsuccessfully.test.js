const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');
const validateSchema = require('#configs/schemaValidation');

let requestManager;
let createdProjectId = '';


const projectSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    key: { type: 'string' },
    name: { type: 'string' },
  },
  required: ['id', 'key', 'name'],
};

const jsonData = {
  key: 'EXIT45', 
  name: 'Example Project128', 
  projectTypeKey: 'software', 
  projectTemplateKey: 'com.pyxis.greenhopper.jira:gh-simplified-scrum-classic', 
  description: 'This is an example project created using the Jira API.',
  assigneeType: 'PROJECT_LEAD', 
};

beforeEach(async () => {
  logger.info('Checking if the project exists before creating a new one');

  requestManager = RequestManager.getInstance(env.environment.base_url);

  try {
    // Check if the project already exists
    const existingProjectsResponse = await requestManager.send(
      'get',
      'project/search',
      {},
      { Authorization: global.basicAuth },
    );

    const existingProjects = existingProjectsResponse.data.values;
    const existingProject = existingProjects.find(
      (project) => project.key === jsonData.key,
    );

    if (existingProject) {
      createdProjectId = existingProject.id;
      logger.info(`Project already exists with ID: ${createdProjectId}`);
      // Optionally, delete the existing project to avoid conflicts
      const deleteResponse = await requestManager.send(
        'delete',
        `project/${createdProjectId}`,
        {},
        { Authorization: global.basicAuth },
      );
      if (deleteResponse.status === 204) {
        logger.info(`Existing project ${createdProjectId} deleted.`);
      } else {
        logger.error(
          `Failed to delete project ${createdProjectId}. Status: ${deleteResponse.status}`,
        );
      }
    } else {
      createdProjectId = '';
    }
  } catch (error) {
    logger.error('Error checking or deleting existing project:', error.response?.data || error.message);
  }
});

test('Create and verify a new project', async () => {
  logger.info('Creating and verifying a new project');

  try {
    // Create the new project
    const createResponse = await requestManager.send(
      'post',
      'project',
      jsonData,
      { Authorization: global.basicAuth, 'Content-Type': 'application/json' },
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

    if (verifyResponse.status === 200) {
      logger.info('Project verification passed.');
      if (verifyResponse.data.name === jsonData.name) {
        logger.info('Project name matches expected.');
      } else {
        logger.error('Project name does not match expected.');
      }

      // Schema
      const validation = validateSchema(verifyResponse.data, projectSchema);
      if (validation.valid) {
        logger.info('-schemaValidator- Response matches schema.');
      } else {
        logger.error('-schemaValidator- Response does not match schema. Validation errors:', validation.errors);
      }
    } else {
      logger.error('Project verification failed. Status:', verifyResponse.status);
    }
  } catch (error) {
    logger.error('Error creating or verifying project:', error.response?.data || error.message);
  }
});

afterEach(async () => {
  if (createdProjectId) {
    logger.info('Deleting the created project');

    try {
      const deleteResponse = await requestManager.send(
        'delete',
        `project/${createdProjectId}`,
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
    } catch (error) {
      logger.error('Error deleting project:', error.response?.data || error.message);
    }
  } else {
    logger.info('No project ID available for deletion.');
  }
});
