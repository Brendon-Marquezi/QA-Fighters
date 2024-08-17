const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');
const validateSchema = require('#configs/schemaValidation');

describe('Issues', () => {
  let requestManager;
  let projectId = '';
  let projectSchema;
  let projectGetSchema;
  let projectData;

  beforeEach(async () => {
    logger.info('Iniciando a criação de um projeto');
    requestManager = RequestManager.getInstance(env.environment.base_url);

    projectSchema = {
      type: 'object',
      properties: {
        self: { type: 'string' },
        id: { type: 'integer' },
        key: { type: 'string' },
      },
      required: ['self', 'id', 'key'],
    };

    projectGetSchema = {
      type: 'object',
      properties: {
        expand: { type: 'string' },
        self: { type: 'string' },
        id: { type: 'string' },
        key: { type: 'string' },
        description: { type: 'string' },
        lead: {
          type: 'object',
          properties: {
            self: { type: 'string' },
            accountId: { type: 'string' },
            avatarUrls: {
              type: 'object',
              properties: {
                '48x48': { type: 'string' },
                '24x24': { type: 'string' },
                '16x16': { type: 'string' },
                '32x32': { type: 'string' },
              },
              required: ['48x48', '24x24', '16x16', '32x32'],
            },
            displayName: { type: 'string' },
            active: { type: 'boolean' },
          },
          required: [
            'self',
            'accountId',
            'avatarUrls',
            'displayName',
            'active',
          ],
        },
        components: {
          type: 'array',
          items: {},
        },
        issueTypes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              self: { type: 'string' },
              id: { type: 'string' },
              description: { type: 'string' },
              iconUrl: { type: 'string' },
              name: { type: 'string' },
              subtask: { type: 'boolean' },
              avatarId: { type: 'integer' },
              hierarchyLevel: { type: 'integer' },
            },
            required: [
              'self',
              'id',
              'description',
              'iconUrl',
              'name',
              'subtask',
              'hierarchyLevel',
            ],
          },
        },
        assigneeType: { type: 'string' },
        versions: {
          type: 'array',
          items: {},
        },
        name: { type: 'string' },
        roles: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
        avatarUrls: {
          type: 'object',
          properties: {
            '48x48': { type: 'string' },
            '24x24': { type: 'string' },
            '16x16': { type: 'string' },
            '32x32': { type: 'string' },
          },
          required: ['48x48', '24x24', '16x16', '32x32'],
        },
        projectTypeKey: { type: 'string' },
        simplified: { type: 'boolean' },
        style: { type: 'string' },
        isPrivate: { type: 'boolean' },
        properties: {
          type: 'object',
          additionalProperties: {},
        },
      },
      required: [
        'expand',
        'self',
        'id',
        'key',
        'description',
        'lead',
        'components',
        'issueTypes',
        'assigneeType',
        'versions',
        'name',
        'roles',
        'avatarUrls',
        'projectTypeKey',
        'simplified',
        'style',
        'isPrivate',
        'properties',
      ],
    };

    projectData = {
      key: 'EXIT503',
      name: 'Example Project503',
      projectTypeKey: 'software',
      projectTemplateKey:
        'com.pyxis.greenhopper.jira:gh-simplified-scrum-classic',
      description: 'This is an example project created using the Jira API.',
      assigneeType: 'PROJECT_LEAD',
      leadAccountId: env.environment.client_id,
    };

    // Create a new project
    const projectResponse = await requestManager.send(
      'post',
      'project',
      {},
      { Authorization: global.basicAuth },
      projectData,
    );

    // Validates the schema of the project creation response
    const projectValidationResult = validateSchema(
      projectResponse.data,
      projectSchema,
    );
    if (projectValidationResult.valid) {
      logger.info('-schemaValidator- Response matches schema.');
    } else {
      logger.error(
        '-schemaValidator- Response does not match schema. Validation errors:',
        projectValidationResult.errors,
      );
    }

    projectId = projectResponse.data.id;
    logger.info(`Project successfully created with ID: ${projectId}`);
  });

  test('Check project search by ID', async () => {
    logger.info('Starting test to search for project by ID');

    // Check if the project was created
    expect(projectId).toBeDefined();

    // Search for project by ID
    const verifyResponse = await requestManager.send(
      'get',
      `project/${projectId}`,
      {},
      { Authorization: global.basicAuth },
    );

    // Validates the schema of the design verification response
    const verifyValidationResult = validateSchema(
      verifyResponse.data,
      projectGetSchema,
    );
    if (!verifyValidationResult.valid) {
      logger.error(
        `Schema validation failed for design verification: ${verifyValidationResult.errors.map((e) => e.message).join(', ')}`,
      );
    }

    expect(verifyResponse.status).toBe(200);
    expect(verifyResponse.data.id).toBe(projectId.toString());
    logger.info(`Project ${projectId} successfully verified.`);
  });

  afterEach(async () => {
    if (projectId) {
      logger.info('Starting project deletion');

      // Delete the project
      const deleteResponse = await requestManager.send(
        'delete',
        `project/${projectId}?enableUndo=false`,
        {},
        { Authorization: global.basicAuth },
      );

      expect(deleteResponse.status).toBe(204);
      logger.info(`Project ${projectId} deleted successfully.`);
    } else {
      logger.error('No project ID available for verification.');
    }
  });
});
