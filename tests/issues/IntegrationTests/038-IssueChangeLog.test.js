const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');
const validateSchema = require('#configs/schemaValidation');

let requestManager;
let createdIssueId;

const changeLogSchema = {
  type: 'object',
  properties: {
    values: {
      type: 'array',
      items: { type: 'object' },
    },
  },
  required: ['values'],
};

beforeEach(async () => {
  requestManager = RequestManager.getInstance(env.environment.base_url);
  logger.info('Starting to create an issue');
  const issueResponse = await requestManager.send(
    'post',
    'issue',
    {},
    { Authorization: global.basicAuth },
    {
      fields: {
        project: {
          id: '10002',
        },
        summary: 'Issue para teste de comentário',
        description: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  text: 'Descrição do issue de teste',
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
    },
  );
  createdIssueId = issueResponse.data.id;
});

afterEach(async () => {
  requestManager = RequestManager.getInstance(env.environment.base_url);
  logger.info('Starting to delete an issue');
  await requestManager.send(
    'delete',
    `issue/${createdIssueId}`,
    {},
    { Authorization: global.basicAuth },
  );
});

test("Check an issue's change log", async () => {
  requestManager = RequestManager.getInstance(env.environment.base_url);
  logger.info('Checking an issue\'s change log');
  
  const endpoint = `issue/${createdIssueId}/changelog`;
  logger.info(`Sending GET request to ${endpoint}`);
  
  const response = await requestManager.send(
    'get',
    endpoint,
    {},
    { Authorization: global.basicAuth },
  );
  
  logger.info(`Response status: ${response.status}`);
  
  if (response.status === 200) {
    logger.info('Response received successfully.');

    logger.info('Validating schema for change log response data:');
    
    const validation = validateSchema(response.data, changeLogSchema);
    if (validation.valid) {
      logger.info('Schema validation passed.');
    } else {
      logger.error('Schema validation failed. Validation errors:', validation.errors);
    }

    expect(response.data).toHaveProperty('values');
  } else {
    logger.error('Failed to retrieve change log. Status:', response.status);
  }
});
