import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { KeyValue } from '@folio/stripes/components';

class AggregatorConfigView extends React.Component {
  renderKeyValue = (key, value, hideValue) => {
    const val = hideValue ? '*'.repeat(value.length) : value;
    return <KeyValue key={key} label={key} value={val} />;
  };

  render() {
    const { aggregatorConfig, hideValues } = this.props;
    if (aggregatorConfig === undefined || _.isEmpty(aggregatorConfig)) {
      return null;
    }
    return Object.entries(aggregatorConfig).map(([key, value]) => this.renderKeyValue(key, value, hideValues));
  }
}

AggregatorConfigView.propTypes = {
  aggregatorConfig: PropTypes.shape().isRequired,
  hideValues: PropTypes.bool
};

export default AggregatorConfigView;
