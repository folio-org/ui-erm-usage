import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import { Accordion } from '@folio/stripes-components/lib/Accordion';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import Select from '@folio/stripes-components/lib/Select';

import SelectedReportsForm from './SelectedReports';
import { AggregatorInfoForm } from '../AggregatorInfo';
import { VendorInfoForm } from '../VendorInfo';

class HarvestingConfigurationForm extends React.Component {
  constructor(props) {
    super(props);

    const useAgg = props.initialValues.aggregator !== undefined || false;
    this.state = {
      use_agg_checkbox: useAgg,
    };
    this.handleUseAggChange = this.handleUseAggChange.bind(this);
    this.cAggregatorForm = this.props.stripes.connect(AggregatorInfoForm);
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
              <this.cAggregatorForm disabled={!this.state.use_agg_checkbox} />
            </Row>
            <Row>
              <Col xs={4}>
                { 'If no aggregator is used please define the vendor\'s SUSHI endpoint' }
              </Col>
              <VendorInfoForm disabled={this.state.use_agg_checkbox} />
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
                <SelectedReportsForm />
              </Col>
            </Row>
          </Col>
        </Row>
      </Accordion>
    );
  }
}

HarvestingConfigurationForm.propTypes = {
  initialValues: PropTypes.object,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
  accordionId: PropTypes.string.isRequired,
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
  }).isRequired,
};

export default HarvestingConfigurationForm;
