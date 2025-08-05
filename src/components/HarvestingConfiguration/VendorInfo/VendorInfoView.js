import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import { Col, KeyValue, NoValue, Row } from '@folio/stripes/components';

const VendorInfoView = ({
  usageDataProvider,
  harvesterImpls,
}) => {
  const currentSType = get(usageDataProvider, 'harvestingConfig.sushiConfig.serviceType', '');
  const serviceType = harvesterImpls ? harvesterImpls.find((e) => e.value === currentSType) : [];
  const serviceTypeLabel = serviceType?.label ?? <NoValue />;

  return (
    <Row>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-erm-usage.information.harvestVia" />}
          value="Counter / Sushi"
        />
      </Col>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-erm-usage.vendorInfo.serviceType" />}
          value={<div data-test-service-type>{serviceTypeLabel}</div>}
        />
      </Col>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-erm-usage.vendorInfo.serviceUrl" />}
          value={usageDataProvider.harvestingConfig?.sushiConfig?.serviceUrl ?? (<NoValue />)}
        />
      </Col>
    </Row>
  );
};

VendorInfoView.propTypes = {
  usageDataProvider: PropTypes.object.isRequired,
  harvesterImpls: PropTypes.arrayOf(PropTypes.object),
};

export default stripesConnect(VendorInfoView);
