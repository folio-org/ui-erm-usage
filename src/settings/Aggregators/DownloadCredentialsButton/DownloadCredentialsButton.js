import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@folio/stripes/components';

import { downloadCredentials } from '../../../util/DownloadCSV';

export default class DownloadCredentialsButton extends React.Component {
  static propTypes = {
    aggregatorId: PropTypes.string.isRequired,
    stripes: PropTypes
      .shape().isRequired,
  };

  constructor(props) {
    super(props);
    this.okapiUrl = props.stripes.okapi.url;
    this.httpHeaders = Object.assign({}, {
      'X-Okapi-Tenant': props.stripes.okapi.tenant,
      'X-Okapi-Token': props.stripes.store.getState().okapi.token,
      'Content-Type': 'application/json',
    });
  }

  onClickDownloadCredentials = () => {
    downloadCredentials(this.props.aggregatorId, this.okapiUrl, this.httpHeaders)
      .catch(err => {
        this.log(err.message);
      });
  }

  render() {
    return (
      <Button
        onClick={() => this.onClickDownloadCredentials()}
      >
        { 'Download Credentials' }
      </Button>
    );
  }
}
