import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  List,
  TextField
} from '@folio/stripes/components';
import css from './ReportList.css';

function ReportList(props) {
  const { onChangeSearch, onClickItem, counterVersion } = props;
  const handleSearchChange = e => onChangeSearch(e);
  const handleItemClick = item => onClickItem(item);

  const reportFormatter = item => (
    <li key={item}>
      <button type="button" className={css.itemControl} onClick={() => { handleItemClick(item); }}>
        {item}
      </button>
    </li>
  );

  const search = 'Search';
  const counterVersionInfo = counterVersion ? `Select Counter ${counterVersion} report` : 'Select Counter report release first!';
  return (
    <div className={css.root}>
      <TextField
        noBorder
        placeholder={search}
        startControl={<Icon icon="search" />}
        onChange={handleSearchChange}
      />
      <div className={css.reportVersionInfo}>
        { counterVersionInfo }
      </div>
      <div className={css.dropdownBody}>
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
  counterVersion: PropTypes.string,
};

export default ReportList;
