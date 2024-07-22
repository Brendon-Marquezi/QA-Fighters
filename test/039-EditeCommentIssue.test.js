require('dotenv').config();
const requestManager = require('./../utils/requestManager');
const basicAuth = 'Basic ' + Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64');
let createdIssueId;

beforeEach(async () => {
    try {
        const issueResponse = await requestManager.send(
            'post',
            'issue',
            {},
            {'Authorization': `${basicAuth}`},
            {
                "fields": {
                    "project": {
                        "id": "10002" 
                    },
                    "summary": "Issue para teste de comentário",
                    "description": {
                        "type": "doc",
                        "version": 1,
                        "content": [
                            {
                                "type": "paragraph",
                                "content": [
                                    {
                                        "text": "Descrição do issue de teste",
                                        "type": "text"
                                    }
                                ]
                            }
                        ]
                    },
                    "issuetype": {
                        "id": "10012" 
                    }
                }
            }
        );

        createdIssueId = issueResponse.data.id;
    } catch (error) {
        console.error('Erro ao criar issue:', error.response ? error.response.data : error.message);
    }
});

afterEach(async () => {
    if (createdIssueId) {
        await requestManager.send(
            'delete',
            `issue/${createdIssueId}`,
            {},
            {'Authorization': `${basicAuth}`}
        );
    }
});

test('Check adding a comment to an issue', async () => {
    try {
        const commentResponse = await requestManager.send(
            'post',
            `issue/${createdIssueId}/comment`,
            {},
            {'Authorization': `${basicAuth}`},
            {
                "body": {
                    "type": "doc",
                    "version": 1,
                    "content": [
                        {
                            "type": "paragraph",
                            "content": [
                                {
                                    "text": "Teste de comentário de uma issue",
                                    "type": "text"
                                }
                            ]
                        }
                    ]
                }
            }
        );

        expect(commentResponse.status).toBe(201);
    } catch (error) {
        console.error('Erro ao adicionar comentário:', error.response ? error.response.data : error.message);
    }
});
