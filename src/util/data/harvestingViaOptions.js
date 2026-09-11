import { FormattedMessage } from 'react-intl';

import { COUNTER_SUSHI } from '../constants';

export default [
  { value: undefined, label: '' },
  { value: 'aggregator', label: <FormattedMessage id="ui-erm-usage.information.aggregator" /> },
  { value: 'sushi', label: COUNTER_SUSHI },
];
