import React from 'react';
import PropTypes from 'prop-types';
import { SubmissionError } from 'redux-form';

class VendorName extends React.Component {
  static propTypes = {
    vendorId: PropTypes.string.isRequired,
    stripes: PropTypes.object,
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
      vendorName: '-',
    };
  }

  componentDidMount() {
    this.fechVendorName(this.props.vendorId);
  }

  componentDidUpdate(prevProps) {
    if (this.props.vendorId !== prevProps.vendorId) {
      this.fechVendorName(this.props.vendorId);
    }
  }

  fechVendorName = (vendorId) => {
    this.setState({ vendorName: '-' });
    return fetch(`${this.okapiUrl}/organizations/${vendorId}`, { headers: this.httpHeaders })
      .then((response) => {
        if (response.status >= 400) {
          throw new SubmissionError({ identifier: `Error ${response.status} retrieving vendor name by id`, _error: 'Fetch vendor name failed' });
        } else {
          return response.json();
        }
      })
      .then((json) => {
        this.setState({
          vendorName: json.name
        });
      });
  }

  render() {
    return (
      <div>
        {this.state.vendorName}
      </div>
    );
  }
}

export default VendorName;
