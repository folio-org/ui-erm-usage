import { isNil } from 'lodash';
import PropTypes from 'prop-types';

import CustomReportInfoFile from './CustomReportInfoFile';
import CustomReportInfoLink from './CustomReportInfoLink';

function CustomReportInfo(props) {
  const { customReport, handlers, onDelete, udpLabel } = props;

  if (!isNil(customReport.fileId)) {
    return (
      <CustomReportInfoFile
        customReport={customReport}
        handlers={handlers}
        onDelete={onDelete}
        udpLabel={udpLabel}
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
  customReport: PropTypes.shape().isRequired,
  handlers: PropTypes.shape({
    doDownloadFile: PropTypes.func,
  }),
  onDelete: PropTypes.func.isRequired,
  udpLabel: PropTypes.string.isRequired,
};

export default CustomReportInfo;
