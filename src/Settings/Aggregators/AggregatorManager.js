import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { EntryManager } from '@folio/stripes/smart-components';
import AggregatorDetails from './AggregatorDetail';
import AggregatorForm from './AggregatorForm';

class AggregatorManager extends React.Component {
  static manifest = Object.freeze({
    entries: {
      type: 'okapi',
      records: 'aggregatorSettings',
      path: 'aggregator-settings',
      resourceShouldRefresh: true,
    }
  });

  static propTypes = {
    label: PropTypes.string.isRequired,
    resources: PropTypes.shape({
      entries: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }).isRequired,
    mutator: PropTypes.shape({
      entries: PropTypes.shape({
        POST: PropTypes.func,
        PUT: PropTypes.func,
        DELETE: PropTypes.func,
      }),
    }).isRequired,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }),
  };

  constructor(props) {
    super(props);
    this.validate = this.validate.bind(this);
    // connect form
    this.cAggregatorForm = props.stripes.connect(AggregatorForm);
  }

  validate() {
    const errors = {};
    // TODO!
    return errors;
  }

  render() {
    const entryList = _.sortBy((this.props.resources.entries || {}).records || [], ['label']);

    return (
      <EntryManager
        {...this.props}
        parentMutator={this.props.mutator}
        entryList={entryList}
        detailComponent={AggregatorDetails}
        entryFormComponent={this.cAggregatorForm}
        paneTitle={this.props.label}
        entryLabel={this.props.label}
        onSelect={this.onSelect}
        validate={this.validate}
        nameKey="label"
        permissions={{
          put: 'settings.erm.enabled',
          post: 'settings.erm.enabled',
          delete: 'settings.erm.enabled',
        }}
      />
    );
  }
}

export default AggregatorManager;
