const RequestManager = require('#utils/requestManager');

describe('RequestManager', () => {
  beforeEach(() => {});

  test('should create a new instance with a unique baseURL', () => {
    const baseURL = 'https://example.com';
    const requestManager = RequestManager.getInstance(baseURL);

    expect(requestManager.baseURL).toBe(baseURL);
  });

  test('should return the same instance if the baseURL is the same', () => {
    const baseURL = 'https://example.com';
    const instance1 = RequestManager.getInstance(baseURL);
    const instance2 = RequestManager.getInstance(baseURL);

    expect(instance1).toBe(instance2);
  });

  test('should use the singleton instance for the same baseURL', () => {
    const baseURL = 'https://example.com';
    const baseURL2 = 'https://google.com';
    const instance1 = RequestManager.getInstance(baseURL);
    const instance2 = RequestManager.getInstance(baseURL2);

    expect(instance1).not.toBe(instance2);
  });

  test('should make a successful request', async () => {
    const baseURL = 'https://www.google.com';
    const requestManager = RequestManager.getInstance(baseURL);

    const response = await requestManager.send('get', '', {}, {});

    expect(response.status).toBe(200);
  });
});
