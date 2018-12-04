import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  FormattedMessage
} from 'react-intl';
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
import { SushiCredentialsForm } from '../SushiCredentials';

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
    const { expanded, accordionId, useAggregator } = this.props;
    const onToggleAccordion = this.props.onToggle;

    const harvestingStatusOptions =
      [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ];

    const reportReleaseOptions =
      [
        { value: 4, label: 'Counter 4' },
        { value: 5, label: 'Counter 5' },
      ];
    const selectedCV = this.props.stripes.store.getState().form['form-udProvider'].values.reportRelease;
    const selectedCounterVersion = parseInt(selectedCV, 10);

    return (
      <Accordion
        label="Harvesting Configuration"
        open={expanded}
        id={accordionId}
        onToggle={onToggleAccordion}
      >
        <Row>
          <Col xs>
            <section className={formCss.separator}>
              <Row>
                <Col xs={4}>
                  <Field
                    label={
                      <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.harvestingStatus">
                        {(msg) => msg + ' *'}
                      </FormattedMessage>
                    }
                    name="harvestingStatus"
                    id="addudp_harvestingstatus"
                    placeholder="Select a harvesting status"
                    component={Select}
                    dataOptions={harvestingStatusOptions}
                    fullWidth
                  />
                </Col>
              </Row>
            </section>
            <section className={formCss.separator}>
              <Row>
                <Col xs={4}>
                  <Checkbox
                    name="useAggregator"
                    label={<FormattedMessage id="ui-erm-usage.udp.form.harvestingConfig.harvestViaAggregator" />}
                    onChange={this.handleUseAggChange}
                    checked={useAggregator}
                  />
                </Col>
                <this.cAggregatorForm disabled={!useAggregator} />
              </Row>
              <Row>
                <Col xs={4}>
                  {<FormattedMessage id="ui-erm-usage.udp.form.harvestingConfig.noAggInfoText" />}
                </Col>
                <VendorInfoForm disabled={useAggregator} />
              </Row>
            </section>
            <section className={formCss.separator}>
              <Row>
                <Col xs={4}>
                  <Field
                    label={
                      <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.reportRelease">
                        {(msg) => msg + ' *'}
                      </FormattedMessage>
                    }
                    name="reportRelease"
                    id="addudp_reportrelease"
                    placeholder="Select the report release"
                    component={Select}
                    dataOptions={reportReleaseOptions}
                    fullWidth
                  />
                </Col>
                <Col xs={8}>
                  <SelectedReportsForm
                    label={
                      <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.requestedReport">
                        {(msg) => msg + ' *'}
                      </FormattedMessage>
                    }
                    initialValues={this.props.initialValues}
                    counterVersion={selectedCounterVersion}
                  />
                </Col>
              </Row>
            </section>
            <section className={formCss.separator}>
              <Row>
                <Col xs={4}>
                  <Field
                    label={
                      <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.harvestingStart">
                        {(msg) => msg + ' *'}
                      </FormattedMessage>
                    }
                    name="harvestingStart"
                    id="input-harvestingStart"
                    component={TextField}
                    placeholder="YYYY-MM"
                    fullWidth
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    label={<FormattedMessage id="ui-erm-usage.udpHarvestingConfig.harvestingEnd" />}
                    name="harvestingEnd"
                    id="input-harvestingEnd"
                    component={TextField}
                    placeholder="YYYY-MM"
                    fullWidth
                  />
                </Col>
              </Row>
            </section>
            <section className={formCss.separator}>
              <SushiCredentialsForm
                accordionId="editSushiCredentials"
                onToggle={onToggleAccordion}
              />
            </section>
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
