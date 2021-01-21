import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { KeyValue, MenuSection } from '@folio/stripes-components';
import { ViewMetaData } from '@folio/stripes-smart-components';

function ReportInfoHeader(props) {
  const { children, customReport, udpLabel } = props;
  return (
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
      {children}
    </MenuSection>
  );
}

ReportInfoHeader.propTypes = {
  children: PropTypes.node,
  customReport: PropTypes.shape().isRequired,
  udpLabel: PropTypes.string.isRequired,
};

export default ReportInfoHeader;
