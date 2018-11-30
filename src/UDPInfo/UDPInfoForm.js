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
import FindVendor from '../FindVendor/FindVendor';

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

    const intialVendorId = props.initialValues.vendorId || '';
    this.state = {
      vendorId: intialVendorId,
    };
  }

  selectVendor(v) {
    this.props.change('vendorId', v.id);
    this.setState({ vendorId: v.id });
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
                  fullWidth
                />
              </Col>
              <Col xs={4}>
                <FindVendor
                  intialVendorId={this.state.vendorId}
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
                  name="platformId"
                  id="addudp_platformid"
                  placeholder="Link the content platform"
                  component={TextField}
                  fullWidth
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
