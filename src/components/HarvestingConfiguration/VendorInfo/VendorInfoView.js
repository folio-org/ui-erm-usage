import { get } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

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
  harvesterImpls: PropTypes.arrayOf(PropTypes.object),
  usageDataProvider: PropTypes.object.isRequired,
};

export default stripesConnect(VendorInfoView);
