import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Col, Row, TextField } from '@folio/stripes/components';

import { validateUrl } from '../../../util/validate';

function NonCounterUploadLink({ linkUrl, onChangeLinkUrl }) {
  const error = validateUrl(linkUrl);
  return (
    <Col xs={12} md={12}>
      <Row data-test-report-link-url>
        <TextField
          error={error}
          id="custom-report-link-url"
          label={
            <FormattedMessage id="ui-erm-usage.statistics.custom.linkUrl" />
          }
          onChange={onChangeLinkUrl}
          required
          valid={error === undefined}
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
