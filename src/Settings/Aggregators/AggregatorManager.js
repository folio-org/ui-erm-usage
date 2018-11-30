import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { EntryManager } from '@folio/stripes/smart-components';
import AggregatorDetails from './AggregatorDetail';
import AggregatorForm from './AggregatorForm';

function validateAgg(values) {
  const mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const errors = {};
  errors.aggregatorConfig = {};
  errors.accountConfig = {};

  if (!values.label) {
    errors.label = 'Please fill this in to continue';
  }

  if (!values.serviceType) {
    errors.serviceType = 'Please fill this in to continue';
  }

  if (!values.serviceUrl) {
    errors.serviceUrl = 'Please fill this in to continue';
  }

  if (!values.aggregatorConfig || !values.aggregatorConfig.apiKey) {
    errors.aggregatorConfig.apiKey = 'Please fill this in to continue';
  }

  if (!values.aggregatorConfig || !values.aggregatorConfig.requestorId) {
    errors.aggregatorConfig.requestorId = 'Please fill this in to continue';
  }

  if (!values.aggregatorConfig || !values.aggregatorConfig.customerId) {
    errors.aggregatorConfig.customerId = 'Please fill this in to continue';
  }

  if (!values.aggregatorConfig || !values.aggregatorConfig.reportRelease) {
    errors.aggregatorConfig.reportRelease = 'Please fill this in to continue';
  }

  if (!values.accountConfig || !values.accountConfig.configType) {
    errors.accountConfig.configType = 'Please fill this in to continue';
  }

  if (!values.accountConfig || !values.accountConfig.configMail) {
    errors.accountConfig.configMail = 'Please fill this in to continue';
  }

  if (values.accountConfig && values.accountConfig.configMail && !(mailRegex.test(values.accountConfig.configMail))) {
    errors.accountConfig.configMail = 'Mail address is not valid';
  }

  return errors;
}

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
    this.cAggregatorForm = props.stripes.connect(AggregatorForm);
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
        validate={validateAgg}
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
