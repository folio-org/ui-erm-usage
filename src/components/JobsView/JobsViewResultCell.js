import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { memo } from 'react';

import { InfoPopover } from '@folio/stripes/components';

import styles from './JobsView.css';

const JobsViewResultCell = ({ errorMessage = '', text }) => {
  const textWithInfo = (
    <span className={styles.alignCentered}>
      {text}
      <InfoPopover content={errorMessage} iconSize="medium" />
    </span>
  );
  return isEmpty(errorMessage) ? text : textWithInfo;
};

JobsViewResultCell.propTypes = {
  errorMessage: PropTypes.string,
  text: PropTypes.string.isRequired,
};

export default memo(JobsViewResultCell);
