// eslint-disable-next-line import/prefer-default-export
export const MAX_FAILED_ATTEMPTS = 5;
export const DAYS_TO_KEEP_LOGS = 60;

export const MOD_SETTINGS = {
  BASE_PATH: 'settings/entries',
  RECORD_NAME: 'items',
  SCOPES: {
    EUSAGE: 'ui-erm-usage.manage',
    HARVESTER: 'mod-erm-usage-harvester.manage'
  },
  CONFIG_NAMES: {
    DAYS_TO_KEEP_LOGS: 'days_to_keep_logs',
    HIDE_CREDENTIALS: 'hide_credentials',
    MAX_FAILED_ATTEMPTS:'max_failed_attempts',
  },
};

export const ERROR_CODES = [
  'INVALID_REPORT_CONTENT',
  'MAXIMUM_FILESIZE_EXCEEDED',
  'MULTIPLE_FILES_NOT_SUPPORTED',
  'UNSUPPORTED_FILE_FORMAT',
  'UNSUPPORTED_REPORT_RELEASE',
  'UNSUPPORTED_REPORT_TYPE',
  'OTHER',
  // special treatment for this code in UI:
  // 'REPORTS_ALREADY_PRESENT',
];
