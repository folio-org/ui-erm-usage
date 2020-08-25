import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { SubmissionError } from 'redux-form';
import { InfoPopover } from '@folio/stripes/components';

class AggregatorContactInfo extends React.Component {
  static propTypes = {
    aggregatorId: PropTypes.string.isRequired,
    stripes: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.okapiUrl = props.stripes.okapi.url;
    this.httpHeaders = Object.assign(
      {},
      {
        'X-Okapi-Tenant': props.stripes.okapi.tenant,
        'X-Okapi-Token': props.stripes.store.getState().okapi.token,
        'Content-Type': 'application/json',
      }
    );

    this.state = {
      contact: null,
    };
  }

  componentDidMount() {
    this.fechAggregator(this.props.aggregatorId);
  }

  componentDidUpdate(prevProps) {
    if (this.props.aggregatorId !== prevProps.aggregatorId) {
      this.fechAggregator(this.props.aggregatorId);
    }
  }

  fechAggregator = (aggregatorId) => {
    return fetch(`${this.okapiUrl}/aggregator-settings/${aggregatorId}`, {
      headers: this.httpHeaders,
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new SubmissionError({
            identifier: `Error ${response.status} retrieving aggregator name by id`,
            _error: 'Fetch agg name failed',
          });
        } else {
          return response.json();
        }
      })
      .then((json) => {
        this.setState({
          contact: json.accountConfig.displayContact,
        });
      });
  };

  renderContactInfo = (contactInfo) => {
    if (!_.isEmpty(contactInfo)) {
      return <InfoPopover content={contactInfo} />;
    } else {
      return null;
    }
  };

  render() {
    const contact = this.renderContactInfo(this.state.contact);
    return <div>{contact}</div>;
  }
}

export default AggregatorContactInfo;
