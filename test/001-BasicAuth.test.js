require('dotenv').config();

const requestManager = require('./../utils/requestManager');

const basicAuth = 'Basic ' + Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64');

test('Verify basic authentication functionality', async () => {
    let response = await requestManager.send(
        "get",
        process.env.JIRA_ENDPOINT,
        {},
        {'Authorization': `${basicAuth}`}
    )

    expect(response.status).toBe(200);
})