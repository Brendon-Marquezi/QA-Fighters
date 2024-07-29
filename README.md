# Teste de API

Este repositório contém testes automatizados para a API Jira. O objetivo é garantir que a API funcione conforme o esperado e esteja em conformidade com os requisitos do projeto. O framework de automação utilizado é Jest, que permite uma arquitetura flexível e escalável.

## Índice

- [Descrição](#descrição)
- [Arquitetura e Estrutura](#arquitetura-e-estrutura)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Execução dos Testes](#execução-dos-testes)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Exemplos de Testes](#exemplos-de-testes)
- [Frameworks Usados](#Frameworks-Usados)
- [Diagramas](#Diagramas)
- [Agradecimentos](#Agradecimentos)

## Descrição

Este projeto contém um conjunto de testes para a API Jira. Os testes são projetados para verificar a funcionalidade, segurança e desempenho da API. Utilizamos um framework de automação baseado em código para garantir a flexibilidade e escalabilidade dos testes.

## Arquitetura e Estrutura

A arquitetura do projeto é projetada para suportar a escalabilidade e flexibilidade, conforme as melhores práticas da indústria. A estrutura inclui:

- **Camada de Testes**: Contém os testes automatizados organizados por categorias e funcionalidades.
- **Camada de Configuração**: Inclui configurações e parâmetros necessários para a execução dos testes.
- **Camada de Utilitários**: Funções auxiliares e bibliotecas que suportam os testes.
- **Camada de Dados**: Armazena dados de teste e modelos de resposta.

### Estrutura dos Testes

Os testes estão organizados da seguinte forma:

- **Testes de Funcionalidade Positivo**: Verificam se a API está funcionando conforme esperado.
- **Testes de Integração Positivo**: Verificam se a API se integra corretamente com outros sistemas e componentes.
- **Testes de Validação**: Confirmam se a API atende aos requisitos e especificações definidas.
- **Testes de Funcionalidade Negativo**: Avaliam se a API lida corretamente com entradas inválidas e cenários de erro.


## Instalação

Para instalar o projeto, siga estas etapas:

1. Clone o repositório:
    ```bash
    git clone https://github.com/usuario/repositorio.git
    ```

2. Navegue até o diretório do projeto:
    ```bash
    cd repositorio
    ```

3. Instale as dependências:
    ```bash
    npm install
    ```

## Configuração

1. Preencher o arquivo `env.json` com as  variáveis de ambiente necessarias:
    ```json
    {
        "base_url": "",
        "auth_url": "",
        "username": "",
        "api_token": "",
        "client_id": "",
        "client_secret": ""
    }
    ```

- Está sem os dados por padrão para manter a segurança.

## Execução dos Testes

Para executar os testes, use o comando:

```bash
npm run test
```

## Estrutura do Projeto
A estrutura do diretório do projeto é a seguinte
```bash
/projeto
|-- /test
|   |-- /functional
|   |-- /security
|   |-- /performance
|
|-- /config
|   |-- config.json
|
|-- /utils
|   |-- helpers.js
|
|-- /data
|   |-- testData.json
|
|-- .env
|-- package.json
|-- README.md
```
## Frameworks Usados
- **Jest:** 
- **Prettier:**
- **Newman:**
- **Axios:**
- **ESLint:**
- **Winston:**




## Information about ESLint
### Convenções Aplicadas

### Ignorar Arquivos

- **Padrão**: `*.config.mjs`, `coverage/*`
- **Justificativa**: Evita verificar arquivos de configuração específicos e diretórios de cobertura de testes para otimizar a execução do ESLint.

### Opções de Linguagem

- **Para arquivos JavaScript**: `sourceType: "commonjs"`
  - **Justificativa**: Especifica o tipo de módulo JavaScript, adequado para projetos Node.js.

### Variáveis Globais

- **Variáveis do Node.js**: Utiliza variáveis globais específicas do ambiente Node.js definidas em `globals.node`.

### Configuração para Testes

- **Arquivos de Teste**: `tests/**/*.js`
  - **Configuração Jest**: Segue recomendações para testes com Jest.
  - **Exceções às Regras**: Desativa uma regra específica para flexibilidade na escrita de testes.

### Integração com Prettier

- **eslintPluginPrettierRecommended**: Aplica regras de formatação recomendadas pelo Prettier automaticamente.



## Information about Winston
### Convenções Aplicadas

1. **Formato do Log**:
   - Cada mensagem de log inclui o nível de log, mensagem, timestamp e o último nome do arquivo de onde o log foi gerado. Utiliza a função `printf` do Winston para formatação.

2. **Criação do Logger**:
   - Utiliza a função `createLogger` do Winston para criar um logger configurado.
   - Configurações incluem `label` para nome da classe ou módulo, `timestamp` formatado para 'YYYY-MM-DD HH:mm:ss' e `colorize` para colorir mensagens no console.

3. **Transportes de Log**:
   - **Console**: Exibe logs no console com nível debug para monitoramento em desenvolvimento.
   - **Arquivos de Log**: Grava logs em arquivos separados para diferentes níveis (`info` e `error`) para registro e monitoramento detalhado.

- logger.error('Mensagem de erro');     
- logger.warn('Mensagem de aviso');      
- logger.info('Mensagem de informação'); 
- logger.http('Mensagem de http');       
- logger.verbose('Mensagem detalhada');  
- logger.debug('Mensagem de depuração'); 
- logger.silly('Mensagem trivial');

## Diagramas
### Diagrama da Estrutura do Framework de Automação
![Diagrama de Estrutura](/Documentation/Diagrama%20da%20Estrutura%20%20do%20Framework.png)

### Diagrama da Arquitetura do Framework de Automação
![Diagrama de Arquitetura](/Documentation/Diagrama%20de%20Arquitetura%20do%20Framework.png)

## Agradecimentos
Gostaríamos de agradecer a todos que contribuíram para este projeto. Agradecemos a sua dedicação e paciência, que foram importantes para o nosso crescimento. Muito obrigado por nos ajudar a melhorar continuamente!
