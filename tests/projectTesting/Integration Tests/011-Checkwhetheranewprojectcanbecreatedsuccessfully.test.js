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
  key: 'EXIT78', 
  name: 'Example Project-89', 
  projectTypeKey: 'software', 
  projectTemplateKey: 'com.pyxis.greenhopper.jira:gh-simplified-scrum-classic', 
  description: 'This is an example project created using the Jira API.',
  assigneeType: 'PROJECT_LEAD', 
};

beforeEach(async () => {
  logger.info('Checking if the project exists before creating a new one');

  requestManager = RequestManager.getInstance(env.environment.base_url);

  try {
    // Verifica se o projeto já existe
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
      // Opcionalmente, exclua o projeto existente para evitar conflitos
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

test('Create and verify a new project (Performance Test)', async () => {
  // Medição de tempo de execução do teste
  const start = Date.now(); // Inicia o cronômetro

  logger.info('Creating and verifying a new project');

  try {
    // Cria o novo projeto
    const createResponse = await requestManager.send(
      'post',
      'project',
      jsonData,
      { Authorization: global.basicAuth, 'Content-Type': 'application/json' },
    );

    createdProjectId = createResponse.data.id;
    logger.info(`Project created successfully with ID: ${createdProjectId}`);

    // Verifica se o projeto foi criado
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

      // Validação do schema
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

  // Medição de tempo de execução do teste
  const end = Date.now(); // Para o cronômetro
  const executionTime = end - start; // Calcula o tempo de execução
  logger.info(`Tempo de execução para criação e verificação do projeto: ${executionTime}ms`);

  // Validação de desempenho
  expect(executionTime).toBeLessThan(2000); // Espera que a criação e verificação sejam concluídas em menos de 2 segundos
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

        // Verifica se o projeto foi realmente excluído
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

