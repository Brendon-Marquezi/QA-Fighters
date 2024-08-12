const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');
const validateSchema = require('#configs/schemaValidation');

// Schema para validar a resposta ao obter o projeto
const projectSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    key: { type: 'string' },
    name: { type: 'string' },
  },
  required: ['id', 'key', 'name']
};

let requestManager;
let projectId = ''; // ID do projeto que será criado e verificado

beforeEach(async () => {
  logger.info('Iniciando a criação de um projeto');

  requestManager = RequestManager.getInstance(env.environment.base_url);

  const projectData = {
    key: 'TESTPROJ',
    name: 'Test Project',
    projectTypeKey: 'software',
    projectTemplateKey: 'com.pyxis.greenhopper.jira:gh-scrum-template',
    lead: 'project_lead_username'
  };

  // Cria um novo projeto
  const projectResponse = await requestManager.send(
    'post',
    'project',
    {},
    { Authorization: global.basicAuth },
    projectData,
  );

  // Valida o schema da resposta da criação do projeto
  const projectValidationResult = validateSchema(projectResponse.data, projectSchema);
  if (!projectValidationResult.valid) {
    logger.error(`Falha na validação do schema para criação de projeto: ${projectValidationResult.errors.map(e => e.message).join(', ')}`);
    throw new Error('Falha na validação do schema');
  }

  projectId = projectResponse.data.id;
  logger.info(`Projeto criado com sucesso com ID: ${projectId}`);
});

test('Verificar busca de projeto por ID', async () => {
  logger.info('Iniciando teste para busca de projeto por ID');

  // Verifica se o projeto foi criado
  expect(projectId).toBeDefined();

  // Busca o projeto pelo ID
  const verifyResponse = await requestManager.send(
    'get',
    `project/${projectId}`,
    {},
    { Authorization: global.basicAuth },
  );

  // Valida o schema da resposta da verificação do projeto
  const verifyValidationResult = validateSchema(verifyResponse.data, projectSchema);
  if (!verifyValidationResult.valid) {
    logger.error(`Falha na validação do schema para verificação de projeto: ${verifyValidationResult.errors.map(e => e.message).join(', ')}`);
    throw new Error('Falha na validação do schema');
  }

  expect(verifyResponse.status).toBe(200);
  expect(verifyResponse.data.id).toBe(projectId);
  logger.info(`Projeto ${projectId} verificado com sucesso.`);
});

afterEach(async () => {
  if (projectId) {
    logger.info('Iniciando a exclusão do projeto');

    // Exclui o projeto
    const deleteResponse = await requestManager.send(
      'delete',
      `project/${projectId}`,
      {},
      { Authorization: global.basicAuth },
    );

    expect(deleteResponse.status).toBe(204);
    logger.info(`Projeto ${projectId} excluído com sucesso.`);
  } else {
    logger.error('Nenhum ID de projeto disponível para verificação.');
  }
});
