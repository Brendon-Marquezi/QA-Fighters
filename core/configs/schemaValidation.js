const Ajv = require('ajv');
const ajv = new Ajv();

// Função para validar resposta de API
function validateSchema(responseData, schema) {
  const validate = ajv.compile(schema);
  const valid = validate(responseData);

  if (!valid) {
    return {
      valid: false,
      errors: validate.errors,
    };
  }
  return {
    valid: true,
    errors: null,
  };
}

module.exports = validateSchema;
