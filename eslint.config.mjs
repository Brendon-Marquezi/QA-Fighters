import globals from "globals";
import pluginJs from "@eslint/js";
import jest from "eslint-plugin-jest";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  {
    ignores: ["*.config.mjs", "coverage/*"]
  },
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},

  {languageOptions: { globals: globals.node, ...globals.jest, }}, //Adicionei essa configuraçã global.jest pois os beforeAll e afterAll da classe jest.setup
  pluginJs.configs.recommended,                                   //não estavam sendo reconhecidos, isso incluir as variáveis globais definidas para o ambiente do Jest.

  {
    files: ["tests/**/*.js"],
    ...jest.configs['flat/recommended'],
    rules: {
      ...jest.configs['flat/recommended'].rules,
      'jest/prefer-expect-assertions': 'off',
    },
  },
  eslintPluginPrettierRecommended,
];