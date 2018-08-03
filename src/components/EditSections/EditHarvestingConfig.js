import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import TextField from '@folio/stripes-components/lib/TextField';
import { Accordion } from '@folio/stripes-components/lib/Accordion';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import Select from '@folio/stripes-components/lib/Select';

class EditHarvestingConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      use_agg_checkbox: true,
    };
  }

  render() {
    const { initialValues, expanded, onToggle, accordionId } = this.props;

    const harvestingStatusOptions =
      [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'in process', label: 'In Process' },
        { value: 'not possible', label: 'Not Possible' }
      ];
    const availableReports = ['JR1', 'JR1 GOA', 'JR2', 'JR3', 'JR3 Mobile', 'JR4', 'JR5', 'DB1', 'DB2', 'BR1', 'BR2', 'BR3', 'BR4', 'BR5', 'BR6', 'BR7', 'MR1', 'MR2', 'TR1', 'TR1 Mobile', 'TR2', 'TR3', 'TR4'];

    const checkBoxes =
      availableReports.map(r =>
        <Field
          label={r}
          name={`requestedReports.${r}`}
          id={r}
          component={Checkbox}
          inline
        />);

    return (
      <Accordion
        label="Harvesting Configuration"
        open={expanded}
        id={accordionId}
        onToggle={onToggle}
      >
        <Row>
          <Col xs={8}>
            <Row>
              <Col xs={4}>
                <Field
                  label="Harvesting Status"
                  name="harvestingStatus"
                  id="addudp_harvestingstatus"
                  component={Select}
                  dataOptions={harvestingStatusOptions}
                  required
                  fullWidth
                />
              </Col>
            </Row>
            <Row>
              <Col xs={4}>
                <Checkbox
                  name="use_aggregator"
                  label="Harvest statistics via an aggregator"
                  onChange={() => { this.setState({ use_agg_checkbox: !this.state.use_agg_checkbox }); }}
                  checked={this.state.use_agg_checkbox}
                />
              </Col>
              <Col xs={4}>
                <Field
                  label="Choose aggregator"
                  name="aggregator.id"
                  id="addudp_aggid"
                  component={TextField}
                  disabled={!this.state.use_agg_checkbox}
                  required
                  fullWidth
                />
              </Col>
              <Col xs={4}>
                <Field
                  label="Vendor code"
                  name="aggregator.vendorCode"
                  id="addudp_vendorcode"
                  component={TextField}
                  disabled={!this.state.use_agg_checkbox}
                  required
                  fullWidth
                />
              </Col>
            </Row>
            <Row>
              <Col xs={4}>
                { 'If no aggregator is used please define the vendor\'s SUSHI endpoint' }
              </Col>
              <Col xs={4}>
                <Field
                  label="Service type"
                  name="serviceType"
                  id="addudp_servicetype"
                  component={TextField}
                  disabled={this.state.use_agg_checkbox}
                  required
                  fullWidth
                />
              </Col>
              <Col xs={4}>
                <Field
                  label="Service URL"
                  name="serviceUrl"
                  id="addudp_serviceurl"
                  component={TextField}
                  disabled={this.state.use_agg_checkbox}
                  required
                  fullWidth
                />
              </Col>
            </Row>
            <Row>
              <Col xs={4}>
                <Field
                  label="Report release"
                  name="reportRelease"
                  id="addudp_reportrelease"
                  component={TextField}
                  required
                  fullWidth
                />
              </Col>
              <Col xs={8}>
                { checkBoxes }
              </Col>
            </Row>
          </Col>
        </Row>
      </Accordion>
    );
  }
}

EditHarvestingConfig.propTypes = {
  initialValues: PropTypes.object,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
  accordionId: PropTypes.string.isRequired,
};

export default EditHarvestingConfig;
