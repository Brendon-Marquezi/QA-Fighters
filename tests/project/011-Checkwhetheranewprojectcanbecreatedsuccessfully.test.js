const env = require('#configs/environments');
const requestManager = require('#utils/requestManager');

const basicAuth =
'Basic ' +
Buffer.from(
`${env.environment.username}:${env.environment.api_token}`,
).toString('base64');

let createdProjectId;

beforeEach(async () => {
try {
const projectResponse = await requestManager.send(
'post',
'project',
{},
{ Authorization: `${basicAuth}` },
{                                               
key: 'TESTE23',
name: 'Example7',
projectTemplateKey:
'com.pyxis.greenhopper.jira:gh-simplified-scrum-classic',
leadAccountId: env.environment.leadAccountId,
},
);

createdProjectId = projectResponse.data.id;
} catch (error) {
console.error(
'Error in beforeEach:',
error.response ? error.response.data : error.message,
);
}
});

test('Check whether a new project can be created successfully', async () => {
try {
const projectResponse = await requestManager.send(
'post',
'project',
{},
{ Authorization: `${basicAuth}` },
{
key: 'TESTE23',
name: 'Example7',
projectTemplateKey:
'com.pyxis.greenhopper.jira:gh-simplified-scrum-classic',
leadAccountId: env.environment.leadAccountId,
},
);

expect(projectResponse.status).toBe(201);
expect(projectResponse.data.key).toBe('TESTE23');
} catch (error) {
console.error(
'Error in test:',
error.response ? error.response.data : error.message,
);
}
});