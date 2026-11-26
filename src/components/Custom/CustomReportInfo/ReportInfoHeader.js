import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  KeyValue,
  MenuSection,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

function ReportInfoHeader({
  children,
  customReport,
  udpLabel,
}) {
  const intl = useIntl();
  return (
    <MenuSection
      id="menu-actions"
      label={intl.formatMessage({ id: 'ui-erm-usage.report.custom.info' })}
      labelTag="h3"
    >
      <ViewMetaData metadata={customReport.metadata} />
      <KeyValue
        label={<FormattedMessage id="ui-erm-usage.usage-data-provider" />}
        value={udpLabel}
      />
      <KeyValue
        label={<FormattedMessage id="ui-erm-usage.general.note" />}
        value={customReport.note}
      />
      {children}
    </MenuSection>
  );
}

export default ReportInfoHeader;
