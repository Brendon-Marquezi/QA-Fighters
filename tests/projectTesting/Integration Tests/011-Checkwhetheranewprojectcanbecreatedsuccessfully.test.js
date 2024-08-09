const env = require('#configs/environments');
const RequestManager = require('#utils/requestManager');

let requestManager;

const jsonData = {
  key: 'TEST1', 
  name: 'Ex091',
  projectTemplateKey: 'com.pyxis.greenhopper.jira:gh-simplified-scrum-classic',
  leadAccountId: '712020:d15a1605-4430-4b91-a7b1-5c958b6ff0bc' 
};

test('Check whether a new project can be created successfully', async () => {
  requestManager = RequestManager.getInstance(env.environment.base_url);

  
  const projectResponse = await requestManager.send(
    'post',
    'project',
    {}, 
    { Authorization: global.basicAuth }, 
    jsonData, 
  );

  
  console.log('Response Status:', projectResponse.status);
  console.log('Response Data:', projectResponse.data);

 
  expect(projectResponse.status).toBe(201);
  expect(projectResponse.data.key).toBe('TEST1');
});
