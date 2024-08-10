const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);
const RequestManager = require('#utils/requestManager');
const validateSchema = require('#configs/schemaValidation');



let requestManager;

let createdGroupId = '';

//Definir o schema personalizado para cada código de teste *
const groupSchema = {
  type: 'object',
  properties: {
    groupId: { type: 'string' },
    name: { type: 'string' }
  },
  required: ['groupId', 'name']
};


const jsonData = {
  name: env.environment.group_name,
};

beforeEach(async () => {
  logger.info('Checking if the group exists before creating a new one');

  requestManager = RequestManager.getInstance(env.environment.base_url);

  // Check if the group already exists
  const existingGroupsResponse = await requestManager.send(
    'get',
    'groups/picker',
    { query: jsonData.name },
    { Authorization: global.basicAuth },
  );

  const existingGroups = existingGroupsResponse.data.groups;
  const existingGroup = existingGroups.find(
    (group) => group.name === jsonData.name,
  );

  if (existingGroup) {
    createdGroupId = existingGroup.groupId;
    logger.info(`Group already exists with ID: ${createdGroupId}`);
    // Optionally, delete the existing group to avoid conflicts
    await requestManager.send(
      'delete',
      `group`,
      { groupId: createdGroupId },
      { Authorization: global.basicAuth },
    );
    logger.info(`Existing group ${createdGroupId} deleted.`);
  } else {
    createdGroupId = '';
  }
});

test('Create and verify a new group', async () => {
  logger.info('Creating and verifying a new group');


  // Create the new group
  const createResponse = await requestManager.send(
    'post',
    'group',
    {},
    { Authorization: global.basicAuth },
    jsonData,
  );

  createdGroupId = createResponse.data.groupId;
  logger.info(`Group created successfully with ID: ${createdGroupId}`);

  // Verify the group was created
  const verifyResponse = await requestManager.send(
    'get',
    `group`,
    { groupId: createdGroupId },
    { Authorization: global.basicAuth },
  );

  if (verifyResponse.status === 200) {
    logger.info('Group verification passed.');
    if (verifyResponse.data.name === jsonData.name) {
      logger.info('Group name matches expected.');
    } else {
      logger.error('Group name does not match expected.');
    }
  } else {
    logger.error('Group verification failed. Status:', verifyResponse.status);
  }


  //Aplicar aqui a validação do do schemaValidator -> Lembrem-se que para cada test o schema muda!

// Verifica que a resposta da API foi bem-sucedida
if (verifyResponse.status === 200) {
  logger.info('-schemaValidator- Group verification passed.');

  // Compara a resposta com o esquema
  const validation = validateSchema(verifyResponse.data, groupSchema);
  if (validation.valid) {
    logger.info('-schemaValidator- Response matches schema.');
  } else {
    logger.error('-schemaValidator- Response does not match schema. Validation errors:', validation.errors);
  }

  // Verifica que o nome do grupo corresponde ao esperado
  if (verifyResponse.data.name === jsonData.name) {
    logger.info('-schemaValidator- Group name matches expected.');
  } else {
    logger.error('-schemaValidator- Group name does not match expected.');
  }
} else {
  logger.error('-schemaValidator- Group verification failed. Status:', verifyResponse.status);
}

});

afterEach(async () => {
  if (createdGroupId) {
    logger.info('Deleting the created group');

    // Delete the created group
    const deleteResponse = await requestManager.send(
      'delete',
      `group`,
      { groupId: createdGroupId },
      { Authorization: global.basicAuth },
    );

    if (deleteResponse.status === 200) {
      logger.info(`Group ${createdGroupId} deleted successfully.`);

      // Verify if the group was actually deleted by searching
      const searchResponse = await requestManager.send(
        'get',
        `groups/picker?query=${encodeURIComponent(jsonData.name)}`,
        {},
        { Authorization: global.basicAuth },
      );

      const remainingGroups = searchResponse.data.groups;
      const deletedGroup = remainingGroups.find(
        (group) => group.groupId === createdGroupId,
      );

      if (!deletedGroup) {
        logger.info(`Confirmation: Group ${createdGroupId} no longer exists.`);
      } else {
        logger.error(`Group ${createdGroupId} still exists.`);
      }
    } else {
      logger.error(
        `Failed to delete group ${createdGroupId}. Status: ${deleteResponse.status}`,
      );
    }
  } else {
    logger.error('No group ID available for deletion.');
  }
});

