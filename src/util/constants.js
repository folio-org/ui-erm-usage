export const API_COUNTER_REPORTS = 'counter-reports';
export const API_COUNTER_REPORTS_DELETE = 'counter-reports/reports/delete';
export const API_COUNTER_REPORTS_ERROR_CODES = 'counter-reports/errors/codes';
export const API_COUNTER_REPORTS_EXPORT = 'counter-reports/export';
export const API_COUNTER_REPORTS_EXPORT_PROVIDER = 'counter-reports/export/provider';
export const API_COUNTER_REPORTS_RELEASES = 'counter-reports/reports/releases';
export const API_COUNTER_REPORTS_SORTED = 'counter-reports/sorted';
export const API_COUNTER_REPORTS_TYPES = 'counter-reports/reports/types';
export const API_COUNTER_REPORTS_UPLOAD_PROVIDER = 'counter-reports/multipartupload/provider';
export const API_CUSTOM_REPORTS = 'custom-reports';
export const API_FILES = 'erm-usage/files';
export const API_HARVESTER_IMPL = 'erm-usage-harvester/impl';
export const API_HARVESTER_JOBS = 'erm-usage-harvester/jobs';
export const API_HARVESTER_PERIODIC = 'erm-usage-harvester/periodic';
export const API_HARVESTER_START = 'erm-usage-harvester/start';
export const API_SETTINGS_ENTRIES = 'settings/entries';
export const API_TAGS = 'tags';
export const API_UDPS = 'usage-data-providers';
export const API_UDPS_SERVICE_TYPES = 'usage-data-providers/sushi-config/service-types';

export const MAX_FAILED_ATTEMPTS = 5;
export const DAYS_TO_KEEP_LOGS = 60;
export const FORM_TYPE_FINAL_FORM = 'final-form';

export const YEAR_MONTH_FORMAT = 'YYYY-MM';
export const COUNTER = 'Counter';
export const CSV = 'CSV';
// Filter value for UDPs without a service type
export const NO_SERVICE_TYPE = '__none__';
export const XLSX = 'XLSX';

export const MOD_SETTINGS = {
  BASE_PATH: API_SETTINGS_ENTRIES,
  RECORD_NAME: 'items',
  SCOPES: {
    EUSAGE: 'ui-erm-usage.manage',
    HARVESTER: 'mod-erm-usage-harvester.manage',
    TAGS: 'ui-tags.tags.manage',
  },
  CONFIG_NAMES: {
    DAYS_TO_KEEP_LOGS: 'days_to_keep_logs',
    HIDE_CREDENTIALS: 'hide_credentials',
    MAX_FAILED_ATTEMPTS: 'max_failed_attempts',
  },
};
