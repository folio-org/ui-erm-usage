import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import {
  Button,
  Dropdown,
  DropdownMenu,
  Icon,
} from '@folio/stripes/components';

import getLegacyTokenHeader from '../../../util/getLegacyTokenHeader';
import { downloadCredentials } from '../../../util/downloadReport';

class DownloadCredentialsButton extends React.Component {
  static propTypes = {
    aggregatorId: PropTypes.string.isRequired,
    stripes: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);
    this.okapiUrl = props.stripes.okapi.url;
    this.httpHeaders = {
      'X-Okapi-Tenant': props.stripes.okapi.tenant,
      ...getLegacyTokenHeader(props.stripes.okapi),
      'Content-Type': 'application/json',
      credentials: 'include',
    };
  }

  onClickDownloadCredentials = (format) => {
    downloadCredentials(
      this.props.aggregatorId,
      format,
      this.okapiUrl,
      this.httpHeaders
    ).catch((err) => {
      this.log(err.message);
    });
  };

  render() {
    return (
      <Dropdown
        label={<FormattedMessage id="ui-erm-usage.settings.credentials.download" />}
      >
        <DropdownMenu>
          <Button
            buttonStyle="dropdownItem"
            onClick={() => this.onClickDownloadCredentials('csv')}
          >
            <Icon icon="arrow-down">
              <FormattedMessage id="ui-erm-usage.settings.credentials.download.csv" />
            </Icon>
          </Button>
          <Button
            buttonStyle="dropdownItem"
            onClick={() => this.onClickDownloadCredentials('xlsx')}
          >
            <Icon icon="arrow-down">
              <FormattedMessage id="ui-erm-usage.settings.credentials.download.xlsx" />
            </Icon>
          </Button>
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default stripesConnect(DownloadCredentialsButton);
