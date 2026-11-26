import { isNil } from 'lodash';

import CustomReportInfoFile from './CustomReportInfoFile';
import CustomReportInfoLink from './CustomReportInfoLink';

function CustomReportInfo({
  customReport,
  handlers,
  onDelete,
  udpLabel,
}) {
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

export default CustomReportInfo;
