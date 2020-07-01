import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import {
  Button,
  Dropdown,
  DropdownButton,
  DropdownMenu,
  Icon,
} from '@folio/stripes/components';

import { downloadCredentials } from '../../../util/downloadReport';

class DownloadCredentialsButton extends React.Component {
  static propTypes = {
    aggregatorId: PropTypes.string.isRequired,
    stripes: PropTypes.shape().isRequired,
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
      isDropdownOpen: false,
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

  onDropdownToggle = () => {
    this.setState(({ isDropdownOpen }) => ({
      isDropdownOpen: !isDropdownOpen,
    }));
  };

  render() {
    return (
      <Dropdown
        open={this.state.isDropdownOpen}
        onToggle={this.onDropdownToggle}
      >
        <DropdownButton data-role="toggle">
          <FormattedMessage id="ui-erm-usage.settings.credentials.download" />
        </DropdownButton>
        <DropdownMenu data-role="menu">
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
