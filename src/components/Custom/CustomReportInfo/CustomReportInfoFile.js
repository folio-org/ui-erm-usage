import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Button,
  Icon,
  KeyValue,
  MenuSection,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

import ReportInfoHeader from './ReportInfoHeader';

function CustomReportInfoFile({
  customReport,
  handlers,
  onDelete,
  udpLabel,
}) {
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
        label={intl.formatMessage({ id: 'ui-erm-usage.general.actions' })}
        labelTag="h3"
      >
        <Button
          buttonStyle="dropdownItem"
          id="download-custom-report-button"
          onClick={() => handlers.doDownloadFile(customReport.fileId, customReport.fileName)}
        >
          <Icon icon="arrow-down">{`Download ${customReport.fileName}`}</Icon>
        </Button>
        <IfPermission perm="ui-erm-usage.reports.delete">
          <Button
            buttonStyle="dropdownItem"
            id="delete-custom-report-button"
            onClick={onDelete}
          >
            <Icon icon="trash">
              <FormattedMessage id="ui-erm-usage.statistics.custom.delete" />
            </Icon>
          </Button>
        </IfPermission>
      </MenuSection>
    </>
  );
}

export default CustomReportInfoFile;
