import {
  get,
  isEmpty,
} from 'lodash';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  ConfirmationModal,
  Row,
} from '@folio/stripes/components';

import formCss from '../../util/sharedStyles/form.css';
import { AggregatorInfoForm } from './AggregatorInfo';
import {
  HarvestingEndField,
  HarvestingStartField,
  HarvestingStatusSelect,
  HarvestingViaSelect,
  ReportReleaseSelect,
} from './Fields';
import SelectedReportsForm from './SelectedReports';
import { SushiCredentialsForm } from './SushiCredentials';
import { VendorInfoForm } from './VendorInfo';

const HarvestingConfigurationForm = ({
  accordionId,
  aggregators,
  expanded,
  harvesterImplementations,
  initialValues,
  form,
  onToggle,
  values,
}) => {
  const [confirmClear, setConfirmClear] = useState(false);
  const [selectedReportRelease, setSelectedReportRelease] = useState('');

  const changeSelectedCounterVersion = (event) => {
    event.preventDefault();

    const val = (event.target.value === '') ? undefined : event.target.value;
    const selectedReportReleaseValues = get(values, 'harvestingConfig.reportRelease', null);

    if (selectedReportReleaseValues !== val) {
      const requestedReports = get(values, 'harvestingConfig.requestedReports', []);

      if (!isEmpty(requestedReports)) {
        setConfirmClear(true);
        setSelectedReportRelease(val);
      } else {
        form.mutators.setReportRelease({}, val);
      }

      if ((val === '4' && values.sushiCredentials?.apiKey) ||
        ((val === '5' || val === '5.1') && values.sushiCredentials?.apiKey && values.sushiCredentials?.requestorId)) {
        form.change('sushiCredentials.apiKey', undefined);
      }
    }
  };

  const changeSelectedHarvestVia = (event) => {
    event.preventDefault();

    form.change(event.target.name, (event.target.value === '') ? undefined : event.target.value);
    form.resetFieldState('sushiCredentials.customerId');
  };

  const confirmClearReports = (confirmation) => {
    if (confirmation) {
      form.mutators.clearSelectedReports({}, values);
      form.mutators.setReportRelease({}, selectedReportRelease);
    }

    setConfirmClear(false);
  };

  const onToggleAccordion = onToggle;
  const harvestVia = get(values, 'harvestingConfig.harvestVia', '');
  const isHarvestingStatusActive = get(values, 'harvestingConfig.harvestingStatus', '') === 'active';
  const isProviderStatusInactive = get(values, 'status', '') === 'inactive';
  const reportRelease = get(values, 'harvestingConfig.reportRelease', '');
  const requestedReports = get(values, 'harvestingConfig.requestedReports', []);

  const confirmationMessage = (
    <FormattedMessage id="ui-erm-usage.udp.form.selectedReports.confirmClearMessage" />
  );

  return (
    <Accordion
      id={accordionId}
      label={<FormattedMessage id="ui-erm-usage.udp.harvestingConfiguration" />}
      onToggle={onToggleAccordion}
      open={expanded}
    >
      <Row>
        <Col xs>
          <section className={formCss.separator}>
            <Row>
              <Col xs={4}>
                <HarvestingStatusSelect
                  disabled={isProviderStatusInactive}
                />
              </Col>
            </Row>
          </section>
          <section className={formCss.separator}>
            <Row>
              <Col xs={4}>
                <HarvestingViaSelect
                  onChange={changeSelectedHarvestVia}
                  required={isHarvestingStatusActive}
                />
              </Col>
              <Col className={formCss.centerNote} xs={8}>
                <FormattedMessage id="ui-erm-usage.udp.form.harvestingConfig.noAggInfoText" />
              </Col>
            </Row>
            <Row>
              <AggregatorInfoForm
                aggregators={aggregators}
                disabled={harvestVia !== 'aggregator'}
                isRequired={isHarvestingStatusActive}
              />
            </Row>
            <VendorInfoForm
              disabled={harvestVia !== 'sushi'}
              harvesterImpls={harvesterImplementations}
              isRequired={isHarvestingStatusActive}
            />
          </section>
          <section className={formCss.separator}>
            <SushiCredentialsForm
              form={form}
              required={isHarvestingStatusActive}
              useAggregator={harvestVia === 'aggregator'}
              values={values}
            />
          </section>
          <section className={formCss.separator}>
            <Row>
              <Col xs={4}>
                <ReportReleaseSelect
                  id="addudp_reportrelease"
                  onChange={changeSelectedCounterVersion}
                  required={isHarvestingStatusActive}
                />
              </Col>
              <Col xs={8}>
                <SelectedReportsForm
                  counterVersion={reportRelease}
                  initialValues={initialValues}
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
                  isRequired={isHarvestingStatusActive}
                />
              </Col>
              <Col xs={4}>
                <HarvestingEndField />
              </Col>
            </Row>
          </section>
        </Col>
      </Row>

      <ConfirmationModal
        confirmLabel={<FormattedMessage id="ui-erm-usage.udp.form.selectedReports.confirmClearLabel" />}
        heading={<FormattedMessage id="ui-erm-usage.udp.form.selectedReports.clearModalHeading" />}
        id="clear-report-selection-confirmation"
        message={confirmationMessage}
        onCancel={() => { confirmClearReports(false); }}
        onConfirm={() => { confirmClearReports(true); }}
        open={confirmClear}
      />
    </Accordion>
  );
};

HarvestingConfigurationForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  aggregators: PropTypes.arrayOf(PropTypes.shape()),
  expanded: PropTypes.bool,
  form: PropTypes.shape({
    change: PropTypes.func,
    mutators: PropTypes.shape({
      clearSelectedReports: PropTypes.func,
      setReportRelease: PropTypes.func,
    }),
    resetFieldState: PropTypes.func,
  }),
  harvesterImplementations: PropTypes.arrayOf(PropTypes.object),
  initialValues: PropTypes.object,
  onToggle: PropTypes.func,
  values: PropTypes.shape(),
};

export default HarvestingConfigurationForm;
