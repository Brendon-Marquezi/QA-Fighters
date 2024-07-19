require('dotenv').config();

const requestManager = require('./../utils/requestManager');

const basicAuth = 'Basic ' + Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64');

test('Create an issue with specified fields', async () => {
    const requestBody = {
        "fields": {
            "description": {
                "content": [
                    {
                        "content": [
                            {
                                "text": "Order entry fails when selecting supplier.",
                                "type": "text"
                            }
                        ],
                        "type": "paragraph"
                    }
                ],
                "type": "doc",
                "version": 1
            },
            "project": {
                "id": "10002"
            },
            "issuetype": {
                "id": "10012"
            },
            "summary": "Teste de edição de nome de uma issue"
        },
        "boards": [
            {
                "id": "7"
            }
        ]
    };

    // Enviar solicitação POST
    let response = await requestManager.send(
        "post",
        process.env.JIRA_ENDPOINT, // O endpoint para criar uma nova issue
        requestBody,
        { 'Authorization': `${basicAuth}`, 'Content-Type': 'application/json' }
    );

    // Verificar status da resposta
    expect(response.status).toBe(201); 

    // Verificar se a resposta contém campos esperados
    expect(response.data).toBeDefined();
    expect(response.data.fields).toBeDefined();
    expect(response.data.fields.summary).toBe("Teste de edição de nome de uma issue");
});
