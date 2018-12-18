import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Field,
  getFormValues
} from 'redux-form';
import {
  FormattedMessage
} from 'react-intl';
import {
  Accordion,
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

    this.cAggregatorForm = this.props.stripes.connect(AggregatorInfoForm);
  }

  getCurrentValues() {
    const { store } = this.props.stripes;
    const state = store.getState();
    return getFormValues('form-udProvider')(state) || {};
  }

  hasHarvestingConfig(values) {
    if (_.isEmpty(values) || _.isEmpty(values.harvestingConfig)) {
      return false;
    } else {
      return true;
    }
  }

  getSelectedHarvestVia() {
    const currentVals = this.getCurrentValues();
    if (this.hasHarvestingConfig(currentVals)) {
      return currentVals.harvestingConfig.harvestVia;
    } else {
      return null;
    }
  }

  getSelectedCounterVersion() {
    const currentVals = this.getCurrentValues();
    if (this.hasHarvestingConfig(currentVals)) {
      return currentVals.harvestingConfig.reportRelease;
    } else {
      return null;
    }
  }

  render() {
    const { expanded, accordionId } = this.props;
    const onToggleAccordion = this.props.onToggle;

    const harvestingStatusOptions =
      [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ];

    const harvestingViaOptions =
      [
        { value: 'aggregator', label: 'Aggregator' },
        { value: 'sushi', label: 'Sushi' }
      ];

    const reportReleaseOptions =
      [
        { value: 4, label: 'Counter 4' },
        { value: 5, label: 'Counter 5' },
      ];

    const selectedHarvestVia = this.getSelectedHarvestVia();
    const selectedCV = this.getSelectedCounterVersion();
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
                    name="harvestingConfig.harvestingStatus"
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
                  <Field
                    label={
                      <FormattedMessage id="ui-erm-usage.udp.form.harvestingConfig.harvestViaAggregator">
                        {(msg) => msg + ' *'}
                      </FormattedMessage>
                    }
                    name="harvestingConfig.harvestVia"
                    id="harvestingConfig.harvestVia"
                    placeholder="Select how to harvest statistics"
                    component={Select}
                    dataOptions={harvestingViaOptions}
                    fullWidth
                  />
                </Col>
                <this.cAggregatorForm disabled={(selectedHarvestVia !== 'aggregator')} />
              </Row>
              <Row>
                <Col xs={4}>
                  {<FormattedMessage id="ui-erm-usage.udp.form.harvestingConfig.noAggInfoText" />}
                </Col>
                <VendorInfoForm disabled={(selectedHarvestVia !== 'sushi')} />
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
                    name="harvestingConfig.reportRelease"
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
                    name="harvestingConfig.harvestingStart"
                    id="input-harvestingStart"
                    component={TextField}
                    placeholder="YYYY-MM"
                    fullWidth
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    label={<FormattedMessage id="ui-erm-usage.udpHarvestingConfig.harvestingEnd" />}
                    name="harvestingConfig.harvestingEnd"
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
  initialValues: PropTypes.object,
};

export default HarvestingConfigurationForm;
