import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { stripesConnect, stripesShape } from '@folio/stripes/core';
import {
  Button,
  Dropdown,
  DropdownMenu,
  Icon,
} from '@folio/stripes/components';

import { downloadCredentials } from '../../../util/downloadReport';

const DownloadCredentialsButton = ({ aggregatorId, stripes }) => {
  const onClickDownloadCredentials = (format) => {
    downloadCredentials(
      aggregatorId,
      format,
      stripes.okapi,
      { 'Content-Type': 'application/json' },
    ).catch((err) => {
      console.log(err.message);
    });
  };

  return (
    <Dropdown
      label={<FormattedMessage id="ui-erm-usage.settings.credentials.download" />}
    >
      <DropdownMenu>
        <Button
          buttonStyle="dropdownItem"
          onClick={() => onClickDownloadCredentials('csv')}
        >
          <Icon icon="arrow-down">
            <FormattedMessage id="ui-erm-usage.settings.credentials.download.csv" />
          </Icon>
        </Button>
        <Button
          buttonStyle="dropdownItem"
          onClick={() => onClickDownloadCredentials('xlsx')}
        >
          <Icon icon="arrow-down">
            <FormattedMessage id="ui-erm-usage.settings.credentials.download.xlsx" />
          </Icon>
        </Button>
      </DropdownMenu>
    </Dropdown>
  );
};

DownloadCredentialsButton.propTypes = {
  aggregatorId: PropTypes.string.isRequired,
  stripes: stripesShape.isRequired,
};

export default stripesConnect(DownloadCredentialsButton);
