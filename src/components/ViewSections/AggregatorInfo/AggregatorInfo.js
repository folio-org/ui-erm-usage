import React from 'react';
import PropTypes from 'prop-types';
import KeyValue from '@folio/stripes-components/lib/KeyValue';

class AggregatorInfo extends React.Component {
  static manifest = Object.freeze({
    aggregator: {
      type: 'okapi',
      path: 'aggregator-settings/%{currentAggregator.id}',
    },
    currentAggregator: { id: null },
  });

  static propTypes = {
    aggregatorId: PropTypes.string.isRequired, // eslint-disable-line
    resources: PropTypes.shape({
      aggregator: PropTypes.shape(),
    }),
    mutator: PropTypes.shape({
      currentAggregator: PropTypes.shape({
        replace: PropTypes.func,
      }),
    }).isRequired,
  }

  constructor(props) {
    super(props);

    this.props.mutator.currentAggregator.replace({ id: props.aggregatorId });
  }

  componentDidUpdate(prevProps) {
    if (this.props.aggregatorId !== prevProps.aggregatorId) {
      this.props.mutator.currentAggregator.replace({ id: this.props.aggregatorId });
    }
  }

  render() {
    const { aggregator } = this.props.resources;
    if (!aggregator || !aggregator.hasLoaded || aggregator.records.length !== 1) return null;
    const currentAgg = aggregator.records[0];

    return (
      <KeyValue label="Aggregator" value={currentAgg.label} />
    );
  }
}

export default AggregatorInfo;
