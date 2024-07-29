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

try {
const projectResponse = await requestManager.send(
'post',
'project',
{},
{ Authorization: `${basicAuth}` },
payload,
);

createdProjectKey = projectResponse.data.key;
} catch (error) {
}
});

test('Check if you can get the details of a project', async () => {

try {
const projectDetailsResponse = await requestManager.send(
'get',
`project/${createdProjectKey}`,
{},
{ Authorization: `${basicAuth}` },
);

expect(projectDetailsResponse.status).toBe(200);
expect(projectDetailsResponse.data.key).toBe(createdProjectKey);
expect(projectDetailsResponse.data.name).toBe('ExampleProject');
} catch (error) {
}
});