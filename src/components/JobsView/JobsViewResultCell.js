import { InfoPopover } from '@folio/stripes/components';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { memo } from 'react';
import styles from './JobsView.css';

const JobsViewResultCell = ({ errorMessage = '', text }) => {
  const textWithInfo = (
    <span className={styles.alignCentered}>
      {text}
      <InfoPopover iconSize="medium" content={errorMessage} />
    </span>
  );
  return isEmpty(errorMessage) ? text : textWithInfo;
};

JobsViewResultCell.propTypes = {
  errorMessage: PropTypes.string,
  text: PropTypes.string.isRequired
};

export default memo(JobsViewResultCell);
