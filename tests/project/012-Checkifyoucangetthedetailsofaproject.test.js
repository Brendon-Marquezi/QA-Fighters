const env = require('#configs/environments');
const requestManager = require('#utils/requestManager');

const basicAuth = 'Basic ' + Buffer.from(
`${env.environment.username}:${env.environment.api_token}`
).toString('base64');

let createdProjectKey;

beforeEach(async () => {
const payload = {
key: 'PROJ',
name: 'ExampleProject',
projectTemplateKey: 'com.pyxis.greenhopper.jira:gh-simplified-scrum-classic',
leadAccountId: env.environment.leadAccountId,
};

console.log('Payload:', JSON.stringify(payload, null, 2));

try {
const projectResponse = await requestManager.send(
'post',
'project',
{},
{ Authorization: `${basicAuth}` },
payload,
);

console.log('Project Response:', projectResponse.data);
createdProjectKey = projectResponse.data.key;
} catch (error) {
console.error('Error in beforeEach:', error.response ? error.response.data : error.message);
}
});

test('Check if you can get the details of a project', async () => {
console.log(`Getting details for project with key: ${createdProjectKey}`);

try {
const projectDetailsResponse = await requestManager.send(
'get',
`project/${createdProjectKey}`,
{},
{ Authorization: `${basicAuth}` },
);

console.log('Project Details Response:', projectDetailsResponse.data);

expect(projectDetailsResponse.status).toBe(200);
expect(projectDetailsResponse.data.key).toBe(createdProjectKey);
expect(projectDetailsResponse.data.name).toBe('ExampleProject');
} catch (error) {
console.error('Error in test:', error.response ? error.response.data : error.message);
}
});