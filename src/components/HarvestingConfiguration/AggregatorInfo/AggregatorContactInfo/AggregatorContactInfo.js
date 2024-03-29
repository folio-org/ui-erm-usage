import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { InfoPopover } from '@folio/stripes/components';
import fetchWithDefaultOptions from '../../../../util/fetchWithDefaultOptions';

class AggregatorContactInfo extends React.Component {
  static propTypes = {
    aggregatorId: PropTypes.string.isRequired,
    stripes: PropTypes.object,
  };

  constructor(props) {
    super(props);

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
    return fetchWithDefaultOptions(
      this.props.stripes.okapi,
      `/aggregator-settings/${aggregatorId}`,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
      .then((response) => {
        if (!response.ok) {
          return Promise.reject(response);
        }
        return response.json();
      })
      .catch(async (resp) => {
        const err = await resp.text().then((text) => text);
        return Promise.reject(err);
      })
      .then((json) => {
        this.setState({
          contact: json.accountConfig.displayContact,
        });
      })
      .catch((error) => {
        this.setState({
          contact: `Error retrieving aggregator info by id: ${error} `,
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
