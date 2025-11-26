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

export const TAGS_SCOPE = 'ui-tags.tags.manage';
