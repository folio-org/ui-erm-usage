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
  isServiceTypeSupported = true,
}) => {
  const currentSType = get(usageDataProvider, 'harvestingConfig.sushiConfig.serviceType', '');
  const serviceType = harvesterImpls?.find((e) => e.value === currentSType);
  const serviceTypeLabel = isServiceTypeSupported
    ? serviceType?.label ?? <NoValue />
    : (
      <FormattedMessage
        id="ui-erm-usage.udpHarvestingConfig.unsupportedValue"
        values={{ value: currentSType }}
      />
    );

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
          value={serviceTypeLabel}
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
  isServiceTypeSupported: PropTypes.bool,
  usageDataProvider: PropTypes.object.isRequired,
};

export default stripesConnect(VendorInfoView);
