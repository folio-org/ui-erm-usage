import { get, isEmpty } from 'lodash';
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
  constructor(props) {
    super(props);

    this.state = {
      confirmClear: false,
      selectedReportRelease: ''
    };
  }

  changeSelectedCounterVersion = event => {
    event.preventDefault();

    const val = event.target.value;
    const selectedReportRelease = get(
      this.props.values,
      'harvestingConfig.reportRelease',
      ''
    );
    if (selectedReportRelease !== val) {
      const requestedReports = get(
        this.props.values,
        'harvestingConfig.requestedReports',
        []
      );
      if (!isEmpty(requestedReports)) {
        this.setState({ confirmClear: true, selectedReportRelease: val });
      } else {
        this.props.form.mutators.setReportRelease({}, val);
      }
    }
  };

  confirmClearReports = confirmation => {
    if (confirmation) {
      this.props.form.mutators.clearSelectedReports({}, this.props.values);
      this.props.form.mutators.setReportRelease(
        {},
        this.state.selectedReportRelease
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
      initialValues,
      values
    } = this.props;
    const { confirmClear } = this.state;
    const onToggleAccordion = this.props.onToggle;
    const harvestVia = get(values, 'harvestingConfig.harvestVia', '');
    const reportRelease = get(values, 'harvestingConfig.reportRelease', '');
    const requestedReports = get(
      values,
      'harvestingConfig.requestedReports',
      []
    );

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
                  harvesterImpls={harvesterImplementations}
                />
              </Row>
            </section>
            <section className={formCss.separator}>
              <Row>
                <Col xs={4}>
                  <ReportReleaseSelect
                    id="addudp_reportrelease"
                    onChange={this.changeSelectedCounterVersion}
                  />
                </Col>
                <Col xs={8}>
                  <SelectedReportsForm
                    initialValues={initialValues}
                    counterVersion={parseInt(reportRelease, 10)}
                    selectedReports={requestedReports}
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
                useAggregator={harvestVia === 'aggregator'}
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
  initialValues: PropTypes.object,
  form: PropTypes.shape({
    mutators: PropTypes.shape({
      clearSelectedReports: PropTypes.func,
      setReportRelease: PropTypes.func
    })
  }),
  onToggle: PropTypes.func,
  values: PropTypes.shape()
};

export default HarvestingConfigurationForm;
