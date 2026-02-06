import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Field } from 'react-final-form';

import { Row, Col, Button, TextField } from '@folio/stripes/components';

function DisplayContact({ fields }) {
  const intl = useIntl();

  const renderSubContact = (elem, index) => {
    return (
      <Row key={elem}>
        <Col xs={8}>
          <Field
            label={intl.formatMessage(
              {
                id: 'ui-erm-usage.aggregator.config.accountConfig.contact.number',
              },
              { number: Number.parseInt(index + 1, 10) }
            )}
            name={elem}
            id={elem}
            component={TextField}
            fullWidth
          />
        </Col>
        <Col xs={4} style={{ textAlign: 'right', marginTop: '25px' }}>
          <Button
            onClick={() => fields.remove(index)}
            buttonStyle="danger"
          >
            <FormattedMessage id="ui-erm-usage.general.remove" />
          </Button>
        </Col>
      </Row>
    );
  };

  return (
    <Row>
      <Col xs={12}>{fields.map(renderSubContact)}</Col>
      <Col xs={12} style={{ paddingTop: '10px' }}>
        <Button onClick={() => fields.push('')}>
          <FormattedMessage id="ui-erm-usage.aggregator.config.addContact" />
        </Button>
      </Col>
    </Row>
  );
}

DisplayContact.propTypes = {
  fields: PropTypes.object,
};

export default DisplayContact;
