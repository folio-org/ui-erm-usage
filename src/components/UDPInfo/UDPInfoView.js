import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  Row,
} from '@folio/stripes/components';

function UDPInfoView(props) {
  const { usageDataProvider, id } = props;
  return (
    <div id={id}>
      <Row>
        <KeyValue
          label={<FormattedMessage id="ui-erm-usage.general.description" />}
          value={usageDataProvider.description}
        />
      </Row>
    </div>
  );
}

UDPInfoView.propTypes = {
  id: PropTypes.string,
  usageDataProvider: PropTypes.object.isRequired,
};

export default UDPInfoView;
