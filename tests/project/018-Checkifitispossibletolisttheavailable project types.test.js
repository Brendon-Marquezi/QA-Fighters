const env = require('#configs/environments');
const requestManager = require('#utils/requestManager');

const basicAuth =
'Basic ' +
Buffer.from(
`${env.environment.username}:${env.environment.api_token}`,
).toString('base64');

test('Check if it is possible to list the available project types', async () => {
try {
const projectTypesResponse = await requestManager.send(
'get',
'project/type',
{},
{ Authorization: `${basicAuth}` },
);

console.log('Project Types Response:', projectTypesResponse.data);

expect(projectTypesResponse.status).toBe(200);
expect(Array.isArray(projectTypesResponse.data)).toBe(true);
expect(projectTypesResponse.data.length).toBeGreaterThan(0);
} catch (error) {
console.error('Error in test:', error.response ? error.response.data : error.message);
}
});