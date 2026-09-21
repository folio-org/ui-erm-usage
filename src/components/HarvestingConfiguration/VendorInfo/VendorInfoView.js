import { get } from 'lodash';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

import { COUNTER_SUSHI } from '../../../util/constants';
import { formatUnsupportedLabel } from '../../../util/harvesterImpls';

const VendorInfoView = ({
  usageDataProvider,
  harvesterImpls,
  isServiceTypeSupported = true,
}) => {
  const intl = useIntl();
  const currentSType = get(usageDataProvider, 'harvestingConfig.sushiConfig.serviceType', '');
  const serviceType = harvesterImpls?.find((e) => e.value === currentSType);
  const serviceTypeLabel = isServiceTypeSupported
    ? serviceType?.label ?? <NoValue />
    : formatUnsupportedLabel(intl, currentSType, false);

  return (
    <Row>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-erm-usage.information.harvestVia" />}
          value={COUNTER_SUSHI}
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
