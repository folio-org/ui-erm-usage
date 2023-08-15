const path = require('path');
const config = require('@folio/jest-config-stripes');

module.exports = {
  ...config,
  setupFiles: [
    ...config.setupFiles,
    path.join(__dirname, './test/jest/setupFiles.js'),
  ],
  setupFilesAfterEnv: [
    ...config.setupFilesAfterEnv,
    path.join(__dirname, './test/jest/setupFilesAfterEnv.js')],
};
