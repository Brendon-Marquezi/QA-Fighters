const RequestManager = require('#utils/requestManager');
const env = require('#configs/environments');
const logger = require('#utils/logger')(__filename);

const requestManager = RequestManager.getInstance(env.environment.base_url);
let createdUserId = null;

// Define a custom timeout for the `afterAll` hook
const TIMEOUT = 6 * 60 * 1000; // 6 minutes

beforeAll(() => {
  global.basicAuth =
    'Basic ' +
    Buffer.from(
      `${env.environment.username}:${env.environment.api_token}`
    ).toString('base64');

  logger.info('Global authentication setup completed.');
});

afterAll((done) => {
  if (createdUserId) {
    logger.info(`Scheduled deletion of user with ID ${createdUserId} in 5 minutes.`);

    setTimeout(async () => {
      const endpoint = `user?accountId=${createdUserId}`;
      
      try {
        const response = await requestManager.send(
          'delete',
          endpoint,
          {},
          { Authorization: global.basicAuth, Accept: 'application/json' }
        );

        if (response.status === 204) {
          logger.info(`User with ID ${createdUserId} deleted successfully.`);
        } else {
          logger.error(`Failed to delete user with ID ${createdUserId}. Status: ${response.status}`);
        }
      } catch (error) {
        logger.error(`Error deleting user with ID ${createdUserId}:`, error.message);
      }
      done(); // Notify Jest that the async operations are complete
    }, 5 * 60 * 1000); // 5 minutes delay
  } else {
    done(); // No user to delete, so just finish the test
  }

  global.basicAuth = null;
  logger.info('Global authentication cleared.');
}, TIMEOUT);

test('Create a user in Jira', async () => {
  logger.info('Starting test: Create a user in Jira');

  const endpoint = 'user'; 
  requestManager = RequestManager.getInstance(env.environment.base_url);

  // Dados do corpo da requisição
  const bodyData = {
    emailAddress: 'smi66114@nowni.com', // Email setar
    products: [], // Produtos associados ao usuário
  };

  try {
    const response = await requestManager.send(
      'post',
      endpoint,
      {},
      { Authorization: global.basicAuth, Accept: 'application/json', 'Content-Type': 'application/json' }, // Headers
      bodyData 
    );

    expect(response.status).toBe(201);

    const user = response.data;
    expect(user).toHaveProperty('accountId');
    expect(user).toHaveProperty('emailAddress');
    expect(user).toHaveProperty('displayName');

    // Store the user ID for future deletion
    createdUserId = user.accountId;
    logger.info(`User created successfully with ID: ${createdUserId}`);
  } catch (error) {
    logger.error('Error creating user:', error.message);
  }
});
