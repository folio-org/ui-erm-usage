import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import CustomReportInfoFile from './CustomReportInfoFile';
import CustomReportInfoLink from './CustomReportInfoLink';

function CustomReportInfo(props) {
  const { customReport, handlers, onDelete, udpLabel } = props;

  if (!_.isNil(customReport.fileId)) {
    return (
      <CustomReportInfoFile
        customReport={customReport}
        onDelete={onDelete}
        udpLabel={udpLabel}
        handlers={handlers}
      />
    );
  } else {
    return (
      <CustomReportInfoLink
        customReport={customReport}
        onDelete={onDelete}
        udpLabel={udpLabel}
      />
    );
  }
}

CustomReportInfo.propTypes = {
  onDelete: PropTypes.func.isRequired,
  customReport: PropTypes.shape().isRequired,
  udpLabel: PropTypes.string.isRequired,
  handlers: PropTypes.shape({
    doDownloadFile: PropTypes.func,
  }),
};

export default CustomReportInfo;
