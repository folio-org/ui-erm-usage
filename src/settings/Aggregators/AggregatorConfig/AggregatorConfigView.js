import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { KeyValue } from '@folio/stripes/components';

const AggregatorConfigView = ({ aggregatorConfig, hideValues }) => {
  const renderKeyValue = (key, value, hideValue) => {
    const val = hideValue ? '*'.repeat(value.length) : value;
    return <KeyValue key={key} label={key} value={val} />;
  };

  if (aggregatorConfig === undefined || isEmpty(aggregatorConfig)) {
    return null;
  }

  return Object.entries(aggregatorConfig).map(([key, value]) => renderKeyValue(key, value, hideValues));
};

AggregatorConfigView.propTypes = {
  aggregatorConfig: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  hideValues: PropTypes.bool,
};

export default AggregatorConfigView;
