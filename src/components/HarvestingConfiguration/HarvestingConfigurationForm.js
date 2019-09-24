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
  ConfirmationModal,
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
  static contextTypes = {
    _reduxForm: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.cAggregatorForm = this.props.stripes.connect(AggregatorInfoForm);
    this.cVendorInfoForm = this.props.stripes.connect(VendorInfoForm);

    this.state = {
      confirmClear: false,
    };
  }

  getFormName() {
    return 'form-udProvider';
  }

  getSelectedReportReleaseFieldName() {
    return 'harvestingConfig.reportRelease';
  }

  getSelectedReportTypesFieldName() {
    return 'harvestingConfig.requestedReports';
  }

  getCurrentValues() {
    const { store } = this.props.stripes;
    const state = store.getState();
    const formName = this.getFormName();
    return getFormValues(formName)(state) || {};
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
      return currentVals.harvestingConfig.reportRelease || 0;
    } else {
      return 0;
    }
  }

  getSelectedCounterReportTypes = () => {
    const currentVals = this.getCurrentValues();
    if (this.hasHarvestingConfig(currentVals)) {
      return currentVals.harvestingConfig.requestedReports || [];
    } else {
      return 0;
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

  updateSelectedCounterVersion = (event, newValue, previousValue) => {
    event.preventDefault();

    if (newValue !== previousValue) {
      this.newCounterVersion = newValue;
      const selectedReports = this.getSelectedCounterReportTypes();
      if (!_.isEmpty(selectedReports)) {
        this.setState({ confirmClear: true });
      } else {
        const { dispatch, change } = this.context._reduxForm;
        dispatch(change(this.getSelectedReportReleaseFieldName(), newValue));
      }
    }
  }

  confirmClearReports = (confirmation) => {
    const { dispatch, change } = this.context._reduxForm;
    if (confirmation) {
      dispatch(change(this.getSelectedReportTypesFieldName(), null));
      dispatch(change(this.getSelectedReportReleaseFieldName(), this.newCounterVersion));
      setTimeout(() => {
        this.forceUpdate();
      });
    }
    this.setState({ confirmClear: false });
  }

  render() {
    const { expanded, accordionId, harvesterImplementations } = this.props;
    const { confirmClear } = this.state;
    const onToggleAccordion = this.props.onToggle;

    const selectedHarvestVia = this.getSelectedHarvestVia();
    const selectedCV = this.getSelectedCounterVersion();
    const isHarvestingActive = this.isHarvestingActive();
    const selectedCounterVersion = parseInt(selectedCV, 10);

    const confirmationMessage = <FormattedMessage id="ui-erm-usage.udp.form.selectedReports.confirmClearMessage" />;

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
                  harvesterImpls={harvesterImplementations}
                />
              </Row>
            </section>
            <section className={formCss.separator}>
              <Row>
                <Col xs={4}>
                  <ReportReleaseSelect
                    name={this.getSelectedReportReleaseFieldName()}
                    id="addudp_reportrelease"
                    onChange={this.updateSelectedCounterVersion}
                  />
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

        <ConfirmationModal
          id="clear-report-selection-confirmation"
          open={confirmClear}
          heading={<FormattedMessage id="ui-erm-usage.udp.form.selectedReports.clearModalHeading" />}
          message={confirmationMessage}
          onConfirm={() => { this.confirmClearReports(true); }}
          onCancel={() => { this.confirmClearReports(false); }}
          confirmLabel={<FormattedMessage id="ui-erm-usage.udp.form.selectedReports.confirmClearLabel" />}
        />

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
  harvesterImplementations: PropTypes.arrayOf(PropTypes.object),
};

export default HarvestingConfigurationForm;
