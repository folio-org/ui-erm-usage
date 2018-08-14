import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import TextField from '@folio/stripes-components/lib/TextField';
import { Accordion } from '@folio/stripes-components/lib/Accordion';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import Select from '@folio/stripes-components/lib/Select';

import {
  EditSelectedReports,
  AggregatorSelect
} from '../../EditSections';

class EditHarvestingConfig extends React.Component {
  constructor(props) {
    super(props);

    const useAgg = props.initialValues.aggregator ? props.initialValues.aggregator : false;
    this.state = {
      use_agg_checkbox: useAgg,
    };
    this.handleUseAggChange = this.handleUseAggChange.bind(this);
    this.cAggregatorSelect = this.props.stripes.connect(AggregatorSelect);
  }

  handleUseAggChange(e) {
    this.setState({ use_agg_checkbox: e.target.checked });
  }

  render() {
    const { expanded, onToggle, accordionId } = this.props;

    const harvestingStatusOptions =
      [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'in process', label: 'In Process' },
        { value: 'not possible', label: 'Not Possible' }
      ];
    const serviceTypeOptions =
      [
        { value: 'SUSHI', label: 'SUSHI' },
        { value: 'SUSHI lite', label: 'SUHSI lite' },
      ];
    const reportReleaseOptions =
      [
        { value: '4', label: 'Counter 4' },
        { value: '5', label: 'Counter 5' },
      ];

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
                  label="Harvesting Status *"
                  name="harvestingStatus"
                  id="addudp_harvestingstatus"
                  placeholder="Select a harvesting status"
                  component={Select}
                  dataOptions={harvestingStatusOptions}
                  required
                  fullWidth
                />
              </Col>
            </Row>
            <Row>
              <Col xs={4}>
                { 'Aggregator *' }
                <Checkbox
                  name="use_aggregator"
                  label="Harvest statistics via an aggregator"
                  onChange={this.handleUseAggChange}
                  checked={this.state.use_agg_checkbox}
                />
              </Col>
              <Col xs={4}>
                <this.cAggregatorSelect disabled={!this.state.use_agg_checkbox} />
              </Col>
              <Col xs={4}>
                <Field
                  label="Vendor code"
                  name="aggregator.vendorCode"
                  id="addudp_vendorcode"
                  placeholder="Enter the aggregator's vendor code"
                  component={TextField}
                  disabled={!this.state.use_agg_checkbox}
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
                  label="Service type *"
                  name="serviceType"
                  id="addudp_servicetype"
                  placeholder="Select the vendor's API"
                  component={Select}
                  dataOptions={serviceTypeOptions}
                  disabled={this.state.use_agg_checkbox}
                  fullWidth
                />
              </Col>
              <Col xs={4}>
                <Field
                  label="Service URL"
                  name="serviceUrl"
                  id="addudp_serviceurl"
                  placeholder="Enter the vendor's service URL"
                  component={TextField}
                  disabled={this.state.use_agg_checkbox}
                  fullWidth
                />
              </Col>
            </Row>
            <Row>
              <Col xs={4}>
                <Field
                  label="Report release *"
                  name="reportRelease"
                  id="addudp_reportrelease"
                  placeholder="Select the report release"
                  component={Select}
                  dataOptions={reportReleaseOptions}
                  required
                  fullWidth
                />
              </Col>
              <Col xs={8}>
                { 'Requested reports *' }
                <br />
                <EditSelectedReports />
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
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
  }).isRequired,
};

export default EditHarvestingConfig;
