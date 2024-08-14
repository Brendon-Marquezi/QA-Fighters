const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');
const validateSchema = require('#configs/schemaValidation');  

let createdIssueId = '';
let requestManager;

const deleteIssueSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    key: { type: 'string' }
  },
  required: ['id', 'key']
};

const jsonData = {
  fields: {
    project: {
      id: '10002',
    },
    summary: 'Issue para teste de exclusão',
    description: {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Descrição do issue de teste para exclusão',
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
};


beforeEach(async () => {
  requestManager = RequestManager.getInstance(env.environment.base_url);
  logger.info('Starting to create an issue');
  const issueResponse = await requestManager.send(
    'post',
    'issue',
    {},
    {Authorization: global.basicAuth},
    jsonData,
  );

  createdIssueId = issueResponse.data.id;
});

test('Check deletion of an issue from a project', async () => {
  requestManager = RequestManager.getInstance(env.environment.base_url);
  logger.info('Check deletion of an issue from a project');
  const deleteResponse = await requestManager.send(
    'delete',
    `issue/${createdIssueId}`,
    {},
    {Authorization: global.basicAuth },
  );

  logger.info('Starting issue selection check');
  expect(deleteResponse.status).toBe(204);

  if (deleteResponse.status === 204) {
    logger.info('Schema validation skipped for status 204 (No Content).');
  } else {
    logger.info('Validating schema for delete response data:', deleteResponse.data);

    const validation = validateSchema(deleteResponse.data, deleteIssueSchema);
    if (validation.valid) {
      logger.info('Schema validation passed.');
    } else {
      logger.error('Schema validation failed. Response data:', JSON.stringify(deleteResponse.data, null, 2));
      logger.error('Validation errors:', JSON.stringify(validation.errors, null, 2));
    }
  }
});
