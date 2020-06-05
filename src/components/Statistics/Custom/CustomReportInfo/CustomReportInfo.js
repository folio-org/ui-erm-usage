import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, KeyValue, MenuSection } from '@folio/stripes-components';
import { ViewMetaData } from '@folio/stripes-smart-components';
import { downloadErmUsageFile } from '../../../../util/downloadCSV';

function CustomReportInfo(props) {
  const { customReport } = props;
  const httpHeaders = Object.assign(
    {},
    {
      'X-Okapi-Tenant': props.stripes.okapi.tenant,
      'X-Okapi-Token': props.stripes.store.getState().okapi.token,
      'Content-Type': 'application/json',
    }
  );
  const headerSection = (
    <MenuSection id="menu-actions" label="Custom Report Info" labelTag="h3">
      <ViewMetaData metadata={customReport.metadata} />
      <KeyValue label="Usage data provider" value={props.udpLabel} />
      <KeyValue label="Note" value={customReport.note} />
      <KeyValue label="Year" value={customReport.year} />
      <KeyValue label="Filesize in kB" value={customReport.fileSize} />
    </MenuSection>
  );
  const actionSection = (
    <MenuSection id="menu-actions" label="Actions" labelTag="h3">
      <Button
        id="download-custom-report-button"
        buttonStyle="dropdownItem"
        onClick={() => downloadErmUsageFile(
          customReport.fileId,
          customReport.fileName,
          props.stripes.okapi.url,
          httpHeaders
        )}
      >
        <Icon icon="arrow-down">{`Download ${customReport.fileName}`}</Icon>
      </Button>
      <Button
        id="delete-custom-report-button"
        buttonStyle="dropdownItem"
        onClick={props.onDelete}
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

CustomReportInfo.propTypes = {
  onDelete: PropTypes.func.isRequired,
  stripes: PropTypes.shape({
    connect: PropTypes.func,
    okapi: PropTypes.shape({
      url: PropTypes.string.isRequired,
      tenant: PropTypes.string.isRequired,
    }).isRequired,
    store: PropTypes.shape({
      getState: PropTypes.func,
    }),
  }).isRequired,
  customReport: PropTypes.shape().isRequired,
  udpLabel: PropTypes.string.isRequired,
};

export default CustomReportInfo;
