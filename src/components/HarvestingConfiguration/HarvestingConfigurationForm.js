import { get, isEmpty } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
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
  ReportReleaseSelect,
} from './Fields';

class HarvestingConfigurationForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmClear: false,
      selectedReportRelease: '',
    };
  }

  changeSelectedCounterVersion = (event) => {
    event.preventDefault();

    const val = parseInt(event.target.value, 10);
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
      if ((val === 4 && this.props.values.sushiCredentials?.apiKey) ||
        (val === 5 && this.props.values.sushiCredentials?.apiKey && this.props.values.sushiCredentials?.requestorId)) {
        this.props.form.change('sushiCredentials.apiKey', undefined);
      }
    }
  };

  confirmClearReports = (confirmation) => {
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
      values,
    } = this.props;
    const { confirmClear } = this.state;
    const onToggleAccordion = this.props.onToggle;
    const harvestVia = get(values, 'harvestingConfig.harvestVia', '');
    const isHarvestingStatusActive = get(values, 'harvestingConfig.harvestingStatus', '') === 'active';
    const reportRelease = get(values, 'harvestingConfig.reportRelease', null);
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
        label={
          <FormattedMessage id="ui-erm-usage.udp.harvestingConfiguration" />
        }
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
                  <HarvestingViaSelect
                    required={isHarvestingStatusActive}
                  />
                </Col>
                <AggregatorInfoForm
                  aggregators={aggregators}
                  required={isHarvestingStatusActive}
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
                  required={isHarvestingStatusActive}
                  harvesterImpls={harvesterImplementations}
                />
              </Row>
            </section>
            <section className={formCss.separator}>
              <Row>
                <Col xs={4}>
                  <ReportReleaseSelect
                    id="addudp_reportrelease"
                    required={isHarvestingStatusActive}
                    onChange={this.changeSelectedCounterVersion}
                  />
                </Col>
                <Col xs={8}>
                  <SelectedReportsForm
                    initialValues={initialValues}
                    counterVersion={reportRelease}
                    required={isHarvestingStatusActive}
                    selectedReports={requestedReports}
                  />
                </Col>
              </Row>
            </section>
            <section className={formCss.separator}>
              <Row>
                <Col xs={4}>
                  <HarvestingStartField
                    required={isHarvestingStatusActive}
                  />
                </Col>
                <Col xs={4}>
                  <HarvestingEndField />
                </Col>
              </Row>
            </section>
            <section className={formCss.separator}>
              <SushiCredentialsForm
                useAggregator={harvestVia === 'aggregator'}
                form={this.props.form}
                values={values}
                required={isHarvestingStatusActive}
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
    change: PropTypes.func,
    mutators: PropTypes.shape({
      clearSelectedReports: PropTypes.func,
      setReportRelease: PropTypes.func,
    }),
  }),
  onToggle: PropTypes.func,
  values: PropTypes.shape(),
};

export default HarvestingConfigurationForm;
