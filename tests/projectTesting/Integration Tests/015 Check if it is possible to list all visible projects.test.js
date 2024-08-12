const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');
const validateSchema = require('#configs/schemaValidation');

// Schema para a resposta ao listar os projetos
const projectListSchema = {
  type: 'object',
  properties: {
    values: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: { type: 'string' },
          name: { type: 'string' },
        },
        required: ['key', 'name'],
      },
    },
  },
  required: ['values'],
};

let requestManager;

beforeEach(() => {
  logger.info('Iniciando a configuração do teste');
  requestManager = RequestManager.getInstance(env.environment.base_url);
});

test('Verificar se é possível listar todos os projetos visíveis', async () => {
  logger.info('Iniciando a listagem de todos os projetos visíveis');

  const response = await requestManager.send(
    'get',
    'project/search',
    {},
    { Authorization: global.basicAuth },
  );

  logger.info('Resposta recebida para os projetos visíveis');

  // Validar o esquema da resposta da lista de projetos
  const projectListValidationResult = validateSchema(response.data, projectListSchema);
  if (!projectListValidationResult.valid) {
    logger.error(`Falha na validação do esquema para a resposta da lista de projetos: ${projectListValidationResult.errors.map(e => e.message).join(', ')}`);
    throw new Error('Falha na validação do esquema');
  }

  expect(response.status).toBe(200);
  expect(Array.isArray(response.data.values)).toBe(true);
  expect(response.data.values.length).toBeGreaterThan(0);
});

