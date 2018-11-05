import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  Accordion,
  Checkbox,
  Col,
  Row,
  Select,
  TextField
} from '@folio/stripes/components';
import formCss from '../sharedStyles/form.css';
import SelectedReportsForm from './SelectedReports';
import { AggregatorInfoForm } from '../AggregatorInfo';
import { VendorInfoForm } from '../VendorInfo';

class HarvestingConfigurationForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleUseAggChange = this.handleUseAggChange.bind(this);
    this.cAggregatorForm = this.props.stripes.connect(AggregatorInfoForm);
  }

  handleUseAggChange(e) {
    this.props.changeUseAggregator(e.target.checked);
  }

  render() {
    const { expanded, onToggle, accordionId, useAggregator } = this.props;

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
    const selectedCounterVersion = this.props.stripes.store.getState().form['form-udProvider'].values.reportRelease;

    return (
      <Accordion
        label="Harvesting Configuration"
        open={expanded}
        id={accordionId}
        onToggle={onToggle}
      >
        <Row>
          <Col xs>
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
                <div className={formCss.label}>
                  { 'Aggregator *' }
                </div>
                <Checkbox
                  name="useAggregator"
                  label="Harvest statistics via an aggregator"
                  onChange={this.handleUseAggChange}
                  checked={useAggregator}
                />
              </Col>
              <this.cAggregatorForm disabled={!useAggregator} />
            </Row>
            <Row>
              <Col xs={4}>
                { 'If no aggregator is used please define the vendor\'s SUSHI endpoint' }
              </Col>
              <VendorInfoForm disabled={useAggregator} />
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
                <SelectedReportsForm
                  label="Requested reports *"
                  initialValues={this.props.initialValues}
                  counterVersion={selectedCounterVersion}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <Field
                  label="Harvesting start *"
                  name="harvestingStart"
                  id="input-harvestingStart"
                  component={TextField}
                  placeholder="YYYY-MM"
                  autoFocus
                  required
                  fullWidth
                />
              </Col>
              <Col xs={3}>
                <Field
                  label="Harvesting end"
                  name="harvestingEnd"
                  id="input-harvestingEnd"
                  component={TextField}
                  placeholder="YYYY-MM"
                  autoFocus
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

HarvestingConfigurationForm.propTypes = {
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
  accordionId: PropTypes.string.isRequired,
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    store: PropTypes.shape({
      getState: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  useAggregator: PropTypes.bool.isRequired,
  changeUseAggregator: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
};

export default HarvestingConfigurationForm;
