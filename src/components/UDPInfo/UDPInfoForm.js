import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  FormattedMessage
} from 'react-intl';
import {
  Accordion,
  Col,
  Row,
  TextField
} from '@folio/stripes/components';
import {
  required
} from '../../util/Validate';
import FindVendor from './FindVendor/FindVendor';

class UDPInfoForm extends React.Component {
  constructor(props) {
    super(props);
    this.columnMapping =
    {
      name: 'Name',
      code: 'Code',
      description: 'description',
    };
    this.selectVendor = this.selectVendor.bind(this);

    const intialVendor = props.initialValues.vendor || '';
    this.state = {
      vendor: intialVendor,
    };
  }

  selectVendor(v) {
    this.props.change('vendor', v);
    this.setState({ vendor: v });
  }

  render() {
    const { expanded, onToggle, accordionId } = this.props;

    return (
      <Accordion
        label={<FormattedMessage id="ui-erm-usage.udp.form.udpInfo.title" />}
        open={expanded}
        id={accordionId}
        onToggle={onToggle}
      >
        <Row>
          <Col xs>
            <Row>
              <Col xs={4}>
                <Field
                  label={
                    <FormattedMessage id="ui-erm-usage.information.providerName">
                      {(msg) => msg + ' *'}
                    </FormattedMessage>}
                  placeholder="Enter a name to identify the usage data provider"
                  name="label"
                  id="addudp_providername"
                  component={TextField}
                  validate={[required]}
                  fullWidth
                />
              </Col>
              <Col xs={4}>
                <FindVendor
                  intialVendor={this.state.vendor}
                  change={this.props.change}
                  stripes={this.props.stripes}
                />
              </Col>
              <Col xs={4}>
                <Field
                  label={
                    <FormattedMessage id="ui-erm-usage.udp.form.udpInfo.contentPlatformId">
                      {(msg) => msg + ' *'}
                    </FormattedMessage>
                  }
                  name="platform.id"
                  id="addudp_platformid"
                  placeholder="Link the content platform"
                  component={TextField}
                  fullWidth
                  validate={[required]}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Accordion>
    );
  }
}

UDPInfoForm.propTypes = {
  stripes: PropTypes.object,
  initialValues: PropTypes.object,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
  accordionId: PropTypes.string.isRequired,
  change: PropTypes.func,
};

export default UDPInfoForm;
