import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  getFormValues
} from 'redux-form';
import {
  FormattedMessage
} from 'react-intl';
import {
  Accordion,
  Col,
  Row,
} from '@folio/stripes/components';
import formCss from '../../util/sharedStyles/form.css';
import SelectedReportsForm from './SelectedReports';
import { AggregatorInfoForm } from './AggregatorInfo';
import { VendorInfoForm } from './VendorInfo';
import { SushiCredentialsForm } from './SushiCredentials';
import {
  HarvestingEndField,
  HarvestingStartField,
  HarvestingStatusSelect,
  HarvestingViaSelect,
  ReportReleaseSelect
} from './Fields';

class HarvestingConfigurationForm extends React.Component {
  constructor(props) {
    super(props);

    this.cAggregatorForm = this.props.stripes.connect(AggregatorInfoForm);
    this.cVendorInfoForm = this.props.stripes.connect(VendorInfoForm);
  }

  getCurrentValues() {
    const { store } = this.props.stripes;
    const state = store.getState();
    return getFormValues('form-udProvider')(state) || {};
  }

  hasHarvestingConfig(values) {
    return (!_.isEmpty(values) && !_.isEmpty(values.harvestingConfig));
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

  isHarvestingActive() {
    const currentVals = this.getCurrentValues();
    if (this.hasHarvestingConfig(currentVals)) {
      return currentVals.harvestingConfig.harvestingStatus === 'active';
    } else {
      return false;
    }
  }

  render() {
    const { expanded, accordionId, harvesterImpls } = this.props;
    const onToggleAccordion = this.props.onToggle;

    const selectedHarvestVia = this.getSelectedHarvestVia();
    const selectedCV = this.getSelectedCounterVersion();
    const isHarvestingActive = this.isHarvestingActive();
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
                  <HarvestingStatusSelect />
                </Col>
              </Row>
            </section>
            <section className={formCss.separator}>
              <Row>
                <Col xs={4}>
                  <HarvestingViaSelect />
                </Col>
                <this.cAggregatorForm
                  disabled={(selectedHarvestVia !== 'aggregator')}
                />
              </Row>
              <Row>
                <Col xs={4}>
                  {<FormattedMessage id="ui-erm-usage.udp.form.harvestingConfig.noAggInfoText" />}
                </Col>
                <this.cVendorInfoForm
                  disabled={(selectedHarvestVia !== 'sushi')}
                  harvestingIsActive={isHarvestingActive}
                  harvesterImpls={harvesterImpls}
                />
              </Row>
            </section>
            <section className={formCss.separator}>
              <Row>
                <Col xs={4}>
                  <ReportReleaseSelect />
                </Col>
                <Col xs={8}>
                  <SelectedReportsForm
                    initialValues={this.props.initialValues}
                    counterVersion={selectedCounterVersion}
                  />
                </Col>
              </Row>
            </section>
            <section className={formCss.separator}>
              <Row>
                <Col xs={4}>
                  <HarvestingStartField />
                </Col>
                <Col xs={4}>
                  <HarvestingEndField />
                </Col>
              </Row>
            </section>
            <section className={formCss.separator}>
              <SushiCredentialsForm
                accordionId="editSushiCredentials"
                onToggle={onToggleAccordion}
                selectedHarvestVia={selectedHarvestVia}
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
  harvesterImpls: PropTypes.arrayOf(PropTypes.object),
};

export default HarvestingConfigurationForm;
