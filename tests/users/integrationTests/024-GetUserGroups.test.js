const env = require('#configs/environments');
const RequestManager = require('#utils/requestManager');
const logger = require('#utils/logger')(__filename);

let requestManager;

// Esquema de validação
const getUserGroupsResponseSchema = {
  status: 200,
  data: [
    {
      groupId: "string",
      name: "string",
      self: "string"
    }
  ]
};

test('Get user groups from Jira', async () => {
  const accountId = env.environment.account_id; 
  requestManager = RequestManager.getInstance(env.environment.base_url);

  const response = await requestManager.send(
    'get',
    `user/groups?accountId=${accountId}`,
    {},
    { Authorization: global.basicAuth, Accept: 'application/json' }
  );

  expect(response.status).toBe(getUserGroupsResponseSchema.status);

  expect(response.data).toBeInstanceOf(Array);

  response.data.forEach((group) => {
    expect(group).toHaveProperty('groupId');
    expect(group).toHaveProperty('name');
    expect(group).toHaveProperty('self');

    console.log(`groupId: "${group.groupId}", name: "${group.name}", self: "${group.self}"`);
  });

  logger.info('Get user groups test passed successfully.');
});
