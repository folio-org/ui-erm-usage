import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Icon, KeyValue, MenuSection } from '@folio/stripes-components';
import { ViewMetaData } from '@folio/stripes-smart-components';

function CustomReportInfoFile(props) {
  const { customReport, handlers, onDelete, udpLabel } = props;
  const headerSection = (
    <MenuSection id="menu-actions" label="Custom Report Info" labelTag="h3">
      <ViewMetaData metadata={customReport.metadata} />
      <KeyValue
        label={<FormattedMessage id="ui-erm-usage.usage-data-provider" />}
        value={udpLabel}
      />
      <KeyValue
        label={<FormattedMessage id="ui-erm-usage.general.note" />}
        value={customReport.note}
      />
      <KeyValue
        label={<FormattedMessage id="ui-erm-usage.general.year" />}
        value={customReport.year}
      />
      <KeyValue
        label={<FormattedMessage id="ui-erm-usage.general.fileSize.kb" />}
        value={customReport.fileSize}
      />
    </MenuSection>
  );

  const actionSection = (
    <MenuSection id="menu-actions" label="Actions" labelTag="h3">
      <Button
        id="download-custom-report-button"
        buttonStyle="dropdownItem"
        onClick={() => handlers.doDownloadFile(customReport.fileId, customReport.fileName)}
      >
        <Icon icon="arrow-down">{`Download ${customReport.fileName}`}</Icon>
      </Button>
      <Button
        id="delete-custom-report-button"
        buttonStyle="dropdownItem"
        onClick={onDelete}
      >
        <Icon icon="arrow-down">Delete custom report</Icon>
      </Button>
    </MenuSection>
  );

  return (
    <>
      {headerSection}
      {actionSection}
    </>
  );
}

CustomReportInfoFile.propTypes = {
  onDelete: PropTypes.func.isRequired,
  customReport: PropTypes.shape().isRequired,
  udpLabel: PropTypes.string.isRequired,
  handlers: PropTypes.shape({
    doDownloadFile: PropTypes.func,
  }),
};

export default CustomReportInfoFile;
