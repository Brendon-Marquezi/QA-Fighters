const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');
const validateSchema = require('#configs/schemaValidation');

// Schema para a resposta ao listar os tipos de projetos
const projectTypeSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      description: { type: 'string' },
    },
    required: ['id', 'name'],
  },
};

let requestManager;

beforeEach(() => {
  logger.info('Iniciando a configuração do teste');
  requestManager = RequestManager.getInstance(env.environment.base_url);
});

test('Verificar se é possível listar os tipos de projetos disponíveis', async () => {
  logger.info('Iniciando a listagem dos tipos de projetos disponíveis');

  const response = await requestManager.send(
    'get',
    'project/type',
    {},
    { Authorization: global.basicAuth },
  );

  logger.info('Resposta recebida para os tipos de projetos');

  // Validar o esquema da resposta para os tipos de projetos
  const projectTypeValidationResult = validateSchema(response.data, projectTypeSchema);
  if (!projectTypeValidationResult.valid) {
    logger.error(`Falha na validação do esquema para a resposta dos tipos de projetos: ${projectTypeValidationResult.errors.map(e => e.message).join(', ')}`);
    throw new Error('Falha na validação do esquema');
  }

  expect(response.status).toBe(200);
  expect(Array.isArray(response.data)).toBe(true);
  expect(response.data.length).toBeGreaterThan(0);
});

