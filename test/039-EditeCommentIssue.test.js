require('dotenv').config();
const requestManager = require('./../utils/requestManager');
const basicAuth = 'Basic ' + Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64');
let createdIssueId; // Variável para armazenar o ID do issue criado

beforeEach(async () => {
    try {
        // Pré-requisição. Criação de um issue 
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

        createdIssueId = issueResponse.data.id; // Armazena o ID do issue criado
    } catch (error) {
        console.error('Erro ao criar issue:', error.response ? error.response.data : error.message);
    }
});

afterEach(async () => {
    // Pós-requisição. Exclusão do issue criado
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

        // Asserção para verificar o resultado da requisição
        expect(commentResponse.status).toBe(201); // Verifique se o código de status é 201 ou o esperado
    } catch (error) {
        console.error('Erro ao adicionar comentário:', error.response ? error.response.data : error.message);
    }
});
