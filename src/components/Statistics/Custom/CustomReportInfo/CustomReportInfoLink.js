import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Icon,
  KeyValue,
  MenuSection,
  TextLink,
} from '@folio/stripes-components';
import { ViewMetaData } from '@folio/stripes-smart-components';

function CustomReportInfoLink(props) {
  const { customReport, onDelete, udpLabel } = props;
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
    </MenuSection>
  );
  const actionSection = (
    <MenuSection id="menu-actions" label="Actions" labelTag="h3">
      <TextLink
        target="_blank"
        rel="noopener noreferrer"
        href={customReport.linkUrl}
      >
        <Icon icon="external-link">{customReport.linkUrl}</Icon>
      </TextLink>
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
  );

  return (
    <>
      {headerSection}
      {actionSection}
    </>
  );
}

CustomReportInfoLink.propTypes = {
  onDelete: PropTypes.func.isRequired,
  customReport: PropTypes.shape().isRequired,
  udpLabel: PropTypes.string.isRequired,
};

export default CustomReportInfoLink;
