import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';

import { Col, Row, TextField } from '@folio/stripes/components';

import { isValidUrl } from '../../../util/validate';

function NonCounterUploadLink({ linkUrl, onChangeLinkUrl }) {
  return (
    <Col xs={12} md={12}>
      <Row data-test-report-link-url>
        <TextField
          error={isValidUrl(linkUrl) ? '' : <FormattedMessage id="ui-erm-usage.errors.enterValidUrl" />}
          id="custom-report-link-url"
          label={<FormattedMessage id="ui-erm-usage.statistics.custom.linkUrlFilePath" />}
          onChange={onChangeLinkUrl}
          required
          value={linkUrl}
        />
      </Row>
    </Col>
  );
}

NonCounterUploadLink.propTypes = {
  linkUrl: PropTypes.string,
  onChangeLinkUrl: PropTypes.func.isRequired,
};

export default injectIntl(NonCounterUploadLink);
