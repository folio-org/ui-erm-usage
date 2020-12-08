import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Icon, MenuSection, TextLink } from '@folio/stripes-components';

import ReportInfoHeader from './ReportInfoHeader';

function CustomReportInfoLink(props) {
  const { customReport, onDelete, udpLabel } = props;

  return (
    <>
      <ReportInfoHeader customReport={customReport} udpLabel={udpLabel} />
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
    </>
  );
}

CustomReportInfoLink.propTypes = {
  onDelete: PropTypes.func.isRequired,
  customReport: PropTypes.shape().isRequired,
  udpLabel: PropTypes.string.isRequired,
};

export default CustomReportInfoLink;
