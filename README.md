**# API Testing
**# API Testing

This repository contains automated tests for the Jira API. The goal is to ensure that the API functions as expected and complies with project requirements. The automation framework used is Jest, which allows for a flexible and scalable architecture.

## Table of Contents

- [Description](#description)
- [Architecture and Structure](#architecture-and-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Test Examples](#test-examples)
- [Used Frameworks](#used-frameworks)
- [Diagrams](#diagrams)
- [Acknowledgements](#acknowledgements)

## Description

This project contains a set of tests for the Jira API. The tests are designed to verify the functionality, security, and performance of the API. We use a code-based automation framework to ensure flexibility and scalability of the tests.

## Architecture and Structure

The project architecture is designed to support scalability and flexibility, following industry best practices. The structure includes:

- **Test Layer**: Contains automated tests organized by categories and functionalities.
- **Configuration Layer**: Includes configurations and parameters necessary for running the tests.
- **Utility Layer**: Helper functions and libraries that support the tests.
- **Data Layer**: Stores test data and response models.

### Test Structure

The tests are organized as follows:

- **Positive Functionality Tests**: Verify if the API is functioning as expected.
- **Positive Integration Tests**: Verify if the API integrates correctly with other systems and components.
- **Validation Tests**: Confirm if the API meets the defined requirements and specifications.
- **Negative Functionality Tests**: Assess if the API handles invalid inputs and error scenarios correctly.

## Installation

To install the project, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/user/repository.git
   ```

2. Navigate to the project directory:

   ```bash
   cd repository
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Fill in the `env.json` file with the necessary environment variables:

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

- It is missing data by default to maintain security.

## Running the Tests

To run the tests, use the command:

```bash
npm run test
```

### Additional Execution Options

**Fail-Fast Execution**: To stop the execution when encountering the first failure, use the command:

```bash
npx jest --bail --runInBand
```

**Fail-Fast Parallel Execution**: To run the tests in parallel and attempt to stop on the first failure, use:

```bash
npx jest --bail --maxWorkers=4
```

## Project Structure

The directory structure of the project is as follows:

```bash
/project
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

## Frameworks Used

- **Jest**
- **Prettier**
- **Newman**
- **Axios**
- **ESLint**
- **Winston**

## Information about ESLint

### Applied Conventions

### Ignore Files

- **Default**: `*.config.mjs`, `coverage/*`
- **Justification**: Avoid checking specific configuration files and test coverage directories to optimize ESLint execution.

### Language Options

- **For JavaScript files**: `sourceType: "commonjs"`
- **Rationale**: Specifies the JavaScript module type, suitable for Node.js projects.

### Global Variables

- **Node.js Variables**: Uses global variables specific to the Node.js environment defined in `globals.node`.

### Test Configuration

- **Test Files**: `tests/**/*.js`
- **Jest Configuration**: Follows recommendations for testing with Jest.
- **Rule Exceptions**: Disables a specific rule for flexibility in writing tests.

### Prettier Integration

- **eslintPluginPrettierRecommended**: Automatically applies formatting rules recommended by Prettier.

## Information about Winston

### Conventions Applied

1. **Log Format**:

- Each log message includes the log level, message, timestamp, and the last file name from which the log was generated. Uses Winston's `printf` function for formatting.

2. **Logger Creation**:

- Uses Winston's `createLogger` function to create a configured logger.
- Settings include `label` for class or module name, `timestamp` formatted to 'YYYY-MM-DD HH:mm:ss', and `colorize` to colorize messages in the console.

3. **Log Transport**:

- **Console**: Displays logs in the console at debug level for monitoring in development.
- **Log Files**: Writes logs to separate files for different levels (`info` and `error`) for detailed logging and monitoring.

- logger.error('Error message');
- logger.warn('Warning message');
- logger.info('Information message');
- logger.http('http message');
- logger.verbose('Verbose message');
- logger.debug('Debug message');
- logger.silly('Trivial message');

## Diagrams

### Automation Framework Structure Diagram

![Diagrama de Estrutura](/Documentation/Diagrama%20da%20Estrutura%20%20do%20Framework.png)

### Automation Framework Architecture Diagram

![Diagrama de Arquitetura](/Documentation/Diagrama%20de%20ArquiteturadoFramework.png)

## Acknowledgements

We would like to thank everyone who contributed to this project. We appreciate your dedication and patience, which have been important to our growth. Thank you very much for helping us continually improve!\*\*
