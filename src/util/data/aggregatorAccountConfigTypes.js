import { FormattedMessage } from 'react-intl';

import { MAIL } from '../constants';

export default [
  { value: MAIL, label: <FormattedMessage id="ui-erm-usage.aggregator.config.accountConfig.mail" /> },
  { value: 'API', label: 'API' },
  { value: 'Manual', label: <FormattedMessage id="ui-erm-usage.aggregator.config.accountConfig.manual" /> },
];
