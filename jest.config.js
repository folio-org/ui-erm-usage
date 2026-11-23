const path = require('path');
const config = require('@folio/jest-config-stripes');

// keyboardjs >= 2.7 is ESM. Remove once @folio/jest-config-stripes lists it (v4).
const transformIgnorePattern = config.transformIgnorePatterns[0].replace(')', '|keyboardjs)');

module.exports = {
  ...config,
  transformIgnorePatterns: [transformIgnorePattern],
  setupFiles: [
    ...config.setupFiles,
    path.join(__dirname, './test/jest/setupFiles.js'),
  ],
  setupFilesAfterEnv: [
    ...config.setupFilesAfterEnv,
    path.join(__dirname, './test/jest/setupFilesAfterEnv.js')],
};
