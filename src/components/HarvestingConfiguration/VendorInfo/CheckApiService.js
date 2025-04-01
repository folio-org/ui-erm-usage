import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  KeyValue,
  Loading,
} from '@folio/stripes/components';

import useServiceStatus from './useServiceStatus';

const CheckApiService = ({ serviceUrl, serviceType }) => {
  const checkURL = `${serviceUrl}${serviceType === 'cs51' ? '/r51' : ''}/status`;
  const { status, fetchStatus, isLoading, error } = useServiceStatus(checkURL);
  const isNotCounter5 = serviceType !== 'cs50' && serviceType !== 'cs51';
  let label = '-';
  if (status === true) {
    label = <FormattedMessage id="ui-erm-usage.vendorInfo.checkStatus.active" />;
  } else if (status === false) {
    label = <FormattedMessage id="ui-erm-usage.vendorInfo.checkStatus.inactive" />;
  } else if (error) {
    label = <FormattedMessage id="ui-erm-usage.vendorInfo.checkStatus.noConnection" />;
  }

  return (
    <>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-erm-usage.vendorInfo.serviceStatus" />}
          value={
            <Button onClick={fetchStatus} disabled={isNotCounter5}>
              {isLoading ? <Loading /> : <FormattedMessage id="ui-erm-usage.vendorInfo.checkStatus" />}
            </Button>
          }
        />
      </Col>
      <Col xs={6} style={{ marginTop: '1rem' }}>
        <p>{isNotCounter5 ? <FormattedMessage id="ui-erm-usage.vendorInfo.checkStatus.notSupported" /> : label}</p>
      </Col>
    </>
  );
};

CheckApiService.propTypes = {
  serviceUrl: PropTypes.string.isRequired,
  serviceType: PropTypes.string.isRequired,
};

export default CheckApiService;
