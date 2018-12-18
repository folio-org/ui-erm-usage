import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage
} from 'react-intl';
import {
  Icon,
  List,
  TextField
} from '@folio/stripes/components';
import css from './ReportList.css';

const counterVersionInfo = cVersion => {
  if (!(undefined === cVersion)) {
    return <FormattedMessage id="ui-erm-usage.udp.form.reportList.selectReportInfo" values={{ counterVersion: cVersion }} />;
  } else {
    return <FormattedMessage id="ui-erm-usage.udp.form.reportList.selectReportFirst" />;
  }
};

function ReportList(props) {
  const { onChangeSearch, onClickItem, counterVersion } = props;
  const handleSearchChange = e => onChangeSearch(e);
  const handleItemClick = item => onClickItem(item);

  const reportFormatter = item => (
    <li key={item}>
      <button
        type="button"
        id={`add-report-${item}`}
        className={css.itemControl}
        onClick={() => { handleItemClick(item); }}
      >
        {item}
      </button>
    </li>
  );

  const search = 'Search';

  const counterVersionInf = counterVersionInfo(counterVersion);
  return (
    <div className={css.root}>
      <TextField
        noBorder
        placeholder={search}
        startControl={<Icon icon="search" />}
        onChange={handleSearchChange}
      />
      <div className={css.reportVersionInfo}>
        { counterVersionInf }
      </div>
      <div
        name="add-report-list"
        className={css.dropdownBody}
      >
        <List
          itemFormatter={reportFormatter}
          items={props.items}
          listClass={css.ReportList}
        />
      </div>
    </div>
  );
}

ReportList.propTypes = {
  onChangeSearch: PropTypes.func.isRequired,
  onClickItem: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  counterVersion: PropTypes.number,
};

export default ReportList;
