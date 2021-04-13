import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import { Button, Checkbox, Icon } from '@folio/stripes/components';

import css from './ReportDeleteButton.css';

class ReportDeleteButton extends React.Component {
  // getButtonStyle = (failedAttempts) => {
  //   if (!failedAttempts) {
  //     return 'success slim';
  //   } else if (failedAttempts < this.props.maxFailedAttempts) {
  //     return 'warning slim';
  //   } else {
  //     return 'danger slim';
  //   }
  // };

  // getButtonIcon = (failedAttempts) => {
  //   if (!failedAttempts) {
  //     return <Icon icon="check-circle" size="small" />;
  //   } else if (failedAttempts < this.props.maxFailedAttempts) {
  //     return <Icon icon="exclamation-circle" />;
  //   } else {
  //     return <Icon icon="times-circle" />;
  //   }
  // };

  render() {
    const { intl, onClick, report, selected } = this.props;
    if (_.isNil(report)) {
      return null;
    }

    // const icon = this.getButtonIcon(report.failedAttempts);
    // const style = this.getButtonStyle(report.failedAttempts);

    // const buttonId = `clickable-download-stats-by-id-${report.reportName}-${report.yearMonth}`;
    // const failedInfo = report.failedAttempts
    //   ? intl.formatMessage({ id: 'ui-erm-usage.statistics.harvesting.error' })
    //   : intl.formatMessage({
    //       id: 'ui-erm-usage.statistics.harvesting.success',
    //     });
    // const label = `Open report info for report ${report.reportName} at year month ${report.yearMonth}. ${failedInfo}`;

    // return (
    //   <React.Fragment>
    //     <div className={css.paddinged}>
    //       <Checkbox
    //         checked={selected}
    //         value={report.id}
    //         onChange={() => onClick(report.id)}
    //       />
    //     </div>
    //     <div className={css.paddinged}>
    //       <Button
    //         aria-label={label}
    //         id={buttonId}
    //         buttonStyle={style}
    //         //   className={css.active}
    //         bottomMargin0
    //         // paddingSide0
    //         align="start"
    //         // aria-haspopup="true"
    //         onClick={() => onClick(report.id)}
    //       >
    //         {icon}
    //       </Button>
    //     </div>
    //   </React.Fragment>
    // );
    return (
      <Checkbox
        checked={selected}
        value={report.id}
        onChange={() => onClick(report.id)}
      />
    );
  }
}

ReportDeleteButton.propTypes = {
  report: PropTypes.object,
  intl: PropTypes.object,
  maxFailedAttempts: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
};

export default stripesConnect(injectIntl(ReportDeleteButton));
