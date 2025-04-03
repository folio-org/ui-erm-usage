import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import { Col, KeyValue, NoValue, Row } from '@folio/stripes/components';

import CheckApiService from './CheckApiService';

const VendorInfoView = ({
  usageDataProvider,
  harvesterImpls,
}) => {
  const currentSType = get(usageDataProvider, 'harvestingConfig.sushiConfig.serviceType', '');
  const serviceType = harvesterImpls ? harvesterImpls.find((e) => e.value === currentSType) : [];
  const serviceTypeLabel = serviceType?.label ?? <NoValue />;
  const serviceUrl = get(usageDataProvider, 'harvestingConfig.sushiConfig.serviceUrl', '');

  return (
    <>
      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-erm-usage.information.harvestVia" />}
            value="Sushi"
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-erm-usage.vendorInfo.serviceType" />}
            value={<div data-test-service-type>{serviceTypeLabel}</div>}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-erm-usage.vendorInfo.serviceUrl" />}
            value={serviceUrl ?? (<NoValue />)}
          />
        </Col>
        <CheckApiService serviceUrl={serviceUrl} serviceType={currentSType} />
      </Row>
    </>
  );
};

VendorInfoView.propTypes = {
  usageDataProvider: PropTypes.object.isRequired,
  harvesterImpls: PropTypes.arrayOf(PropTypes.object),
};

export default stripesConnect(VendorInfoView);
