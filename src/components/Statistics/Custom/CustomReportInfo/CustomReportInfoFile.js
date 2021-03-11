import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Icon, KeyValue, MenuSection } from '@folio/stripes-components';

import ReportInfoHeader from './ReportInfoHeader';

function CustomReportInfoFile(props) {
  const { customReport, handlers, onDelete, udpLabel } = props;
  const intl = useIntl();

  return (
    <>
      <ReportInfoHeader customReport={customReport} udpLabel={udpLabel}>
        <KeyValue
          label={<FormattedMessage id="ui-erm-usage.general.year" />}
          value={customReport.year}
        />
        <KeyValue
          label={<FormattedMessage id="ui-erm-usage.general.fileSize.kb" />}
          value={customReport.fileSize}
        />
      </ReportInfoHeader>
      <MenuSection
        id="menu-actions"
        label={intl.formatMessage({
          id: 'ui-erm-usage.general.actions',
        })}
        labelTag="h3"
      >
        <Button
          id="download-custom-report-button"
          buttonStyle="dropdownItem"
          onClick={() =>
            handlers.doDownloadFile(customReport.fileId, customReport.fileName)
          }
        >
          <Icon icon="arrow-down">{`Download ${customReport.fileName}`}</Icon>
        </Button>
        <Button
          id="delete-custom-report-button"
          buttonStyle="dropdownItem"
          onClick={onDelete}
        >
          <Icon icon="trash">
            <FormattedMessage id="ui-erm-usage.statistics.custom.delete" />
          </Icon>
        </Button>
      </MenuSection>
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
