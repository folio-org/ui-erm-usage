import { isEmpty } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Col,
  ConfirmationModal,
  Row
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
    _reduxForm: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      confirmClear: false
    };
  }

  getSelectedReportReleaseFieldName() {
    return 'harvestingConfig.reportRelease';
  }

  getSelectedReportTypesFieldName() {
    return 'harvestingConfig.requestedReports';
  }

  updateSelectedCounterVersion = (event, newValue, previousValue) => {
    event.preventDefault();

    if (newValue !== previousValue) {
      this.newCounterVersion = newValue;
      if (!isEmpty(this.props.selectedReports)) {
        this.setState({ confirmClear: true });
      } else {
        const { dispatch, change } = this.context._reduxForm;
        dispatch(change(this.getSelectedReportReleaseFieldName(), newValue));
      }
    }
  };

  confirmClearReports = confirmation => {
    const { dispatch, change } = this.context._reduxForm;
    if (confirmation) {
      dispatch(change(this.getSelectedReportTypesFieldName(), null));
      dispatch(
        change(this.getSelectedReportReleaseFieldName(), this.newCounterVersion)
      );
      setTimeout(() => {
        this.forceUpdate();
      });
    }
    this.setState({ confirmClear: false });
  };

  render() {
    const {
      aggregators,
      expanded,
      accordionId,
      harvesterImplementations,
      harvestingStatus,
      harvestVia,
      initialValues,
      reportRelease,
      selectedReports
    } = this.props;
    const { confirmClear } = this.state;
    const onToggleAccordion = this.props.onToggle;
    const selectedCounterVersion = parseInt(reportRelease, 10);

    const confirmationMessage = (
      <FormattedMessage id="ui-erm-usage.udp.form.selectedReports.confirmClearMessage" />
    );

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
                <AggregatorInfoForm
                  aggregators={aggregators}
                  disabled={harvestVia !== 'aggregator'}
                />
              </Row>
              <Row>
                <Col xs={4}>
                  {
                    <FormattedMessage id="ui-erm-usage.udp.form.harvestingConfig.noAggInfoText" />
                  }
                </Col>
                <VendorInfoForm
                  disabled={harvestVia !== 'sushi'}
                  harvestingIsActive={harvestingStatus === 'active'}
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
                    initialValues={initialValues}
                    counterVersion={selectedCounterVersion}
                    selectedReports={selectedReports}
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
              />
            </section>
          </Col>
        </Row>

        <ConfirmationModal
          id="clear-report-selection-confirmation"
          open={confirmClear}
          heading={
            <FormattedMessage id="ui-erm-usage.udp.form.selectedReports.clearModalHeading" />
          }
          message={confirmationMessage}
          onConfirm={() => {
            this.confirmClearReports(true);
          }}
          onCancel={() => {
            this.confirmClearReports(false);
          }}
          confirmLabel={
            <FormattedMessage id="ui-erm-usage.udp.form.selectedReports.confirmClearLabel" />
          }
        />
      </Accordion>
    );
  }
}

HarvestingConfigurationForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  aggregators: PropTypes.arrayOf(PropTypes.shape()),
  expanded: PropTypes.bool,
  harvesterImplementations: PropTypes.arrayOf(PropTypes.object),
  harvestingStatus: PropTypes.string,
  harvestVia: PropTypes.string,
  initialValues: PropTypes.object,
  onToggle: PropTypes.func,
  reportRelease: PropTypes.string,
  selectedReports: PropTypes.arrayOf(PropTypes.string)
};

export default HarvestingConfigurationForm;
