import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Button,
  Icon,
  MenuSection,
  TextLink,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

import ReportInfoHeader from './ReportInfoHeader';

function CustomReportInfoLink({
  customReport,
  onDelete,
  udpLabel,
}) {
  const intl = useIntl();

  return (
    <>
      <ReportInfoHeader customReport={customReport} udpLabel={udpLabel} />
      <MenuSection
        id="menu-actions"
        label={intl.formatMessage({ id: 'ui-erm-usage.general.actions' })}
        labelTag="h3"
      >
        <TextLink
          href={customReport.linkUrl}
          id="custom-report-link"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon icon="external-link">{customReport.linkUrl}</Icon>
        </TextLink>
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

export default CustomReportInfoLink;
