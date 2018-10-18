import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { SubmissionError } from 'redux-form';

class AggregatorName extends React.Component {
  static propTypes = {
    aggregatorId: PropTypes.string.isRequired,
    stripes: PropTypes.object,
    asLink: PropTypes.bool,
  }

  defaultProps = {
    asLink: false,
  }

  constructor(props) {
    super(props);
    this.okapiUrl = props.stripes.okapi.url;
    this.httpHeaders = Object.assign({}, {
      'X-Okapi-Tenant': props.stripes.okapi.tenant,
      'X-Okapi-Token': props.stripes.store.getState().okapi.token,
      'Content-Type': 'application/json',
    });

    this.state = {
      aggregatorName: '-',
    };
  }

  componentDidMount() {
    this.fechAggregatorName(this.props.aggregatorId);
  }

  componentDidUpdate(prevProps) {
    if (this.props.aggregatorId !== prevProps.aggregatorId) {
      this.fechAggregatorName(this.props.aggregatorId);
    }
  }

  fechAggregatorName = (aggregatorId) => {
    return fetch(`${this.okapiUrl}/aggregator-settings/${aggregatorId}`, { headers: this.httpHeaders })
      .then((response) => {
        if (response.status >= 400) {
          throw new SubmissionError({ identifier: `Error ${response.status} retrieving aggregator name by id`, _error: 'Fetch agg name failed' });
        } else {
          return response.json();
        }
      })
      .then((json) => {
        this.setState({
          aggregatorName: json.label
        });
      });
  }

  renderAggregatorName = (aggregatorName, aggregatorId, asLink, stripes) => {
    if (asLink && stripes.hasPerm('settings.erm-usage.enabled')) {
      return (
        <Link to={`/settings/ermusage/aggregators/${aggregatorId}`}>
          {aggregatorName}
        </Link>
      );
    } else {
      return aggregatorName;
    }
  }

  render() {
    const { stripes, asLink, aggregatorId } = this.props;
    const aggName = this.renderAggregatorName(this.state.aggregatorName, aggregatorId, asLink, stripes);
    return (
      <div>
        {aggName}
      </div>
    );
  }
}

export default AggregatorName;
