import React from 'react';
import PropTypes from 'prop-types';

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

  fechVendorName = (vendorId) => {
    return fetch(`${this.okapiUrl}/vendor/${vendorId}`, { headers: this.httpHeaders })
      .then((response) => {
        if (response.status >= 400) {
          // throw new SubmissionError({ patron: { identifier: `Error ${response.status} retrieving patron by id`, _error: 'Scan failed' } });
          console.log('error');
          return null;
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
    this.fechVendorName(this.props.vendorId);
    return (
      <div>
        {this.state.vendorName}
      </div>
    );
  }
}

export default VendorName;
