import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Icon, MenuSection, TextLink } from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

import ReportInfoHeader from './ReportInfoHeader';

function CustomReportInfoLink(props) {
  const { customReport, onDelete, udpLabel } = props;
  const intl = useIntl();

  return (
    <>
      <ReportInfoHeader customReport={customReport} udpLabel={udpLabel} />
      <MenuSection
        id="menu-actions"
        label={intl.formatMessage({
          id: 'ui-erm-usage.general.actions',
        })}
        labelTag="h3"
      >
        <TextLink
          id="custom-report-link"
          target="_blank"
          rel="noopener noreferrer"
          href={customReport.linkUrl}
        >
          <Icon icon="external-link">{customReport.linkUrl}</Icon>
        </TextLink>
        <IfPermission perm="ui-erm-usage.reports.delete">
          <Button
            id="delete-custom-report-button"
            buttonStyle="dropdownItem"
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

CustomReportInfoLink.propTypes = {
  onDelete: PropTypes.func.isRequired,
  customReport: PropTypes.shape().isRequired,
  udpLabel: PropTypes.string.isRequired,
};

export default CustomReportInfoLink;
