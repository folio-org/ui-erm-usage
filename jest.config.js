const path = require('path');
const config = require('@folio/jest-config-stripes');

// keyboardjs ships uncompiled ESM and must be transformed by jest
const esModules = [
  '@folio',
  '@json2csv',
  'decode-uri-component',
  'filter-obj',
  'find-up',
  'get-stdin',
  'global-dirs',
  'import-lazy',
  'inquirer',
  'is-path-inside',
  'jspdf',
  'keyboardjs',
  'ky',
  'query-string',
  'resolve-from',
  'resolve-pkg',
  'split-on-first',
  'uuid',
].join('|');

module.exports = {
  ...config,
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  setupFiles: [
    ...config.setupFiles,
    path.join(__dirname, './test/jest/setupFiles.js'),
  ],
  setupFilesAfterEnv: [
    ...config.setupFilesAfterEnv,
    path.join(__dirname, './test/jest/setupFilesAfterEnv.js')],
};
