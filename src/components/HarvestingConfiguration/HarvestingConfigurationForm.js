import PropTypes from 'prop-types';
import { get, isEmpty } from 'lodash';
import { useState } from 'react';
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
  const reportRelease = get(values, 'harvestingConfig.reportRelease', '');
  const requestedReports = get(values, 'harvestingConfig.requestedReports', []);

  const confirmationMessage = (
    <FormattedMessage id="ui-erm-usage.udp.form.selectedReports.confirmClearMessage" />
  );

  return (
    <Accordion
      label={<FormattedMessage id="ui-erm-usage.udp.harvestingConfiguration" />}
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
                  onChange={changeSelectedHarvestVia}
                />
              </Col>
              <Col xs={8} className={formCss.centerNote}>
                <FormattedMessage id="ui-erm-usage.udp.form.harvestingConfig.noAggInfoText" />
              </Col>
            </Row>
            <Row>
              <AggregatorInfoForm
                aggregators={aggregators}
                isRequired={isHarvestingStatusActive}
                disabled={harvestVia !== 'aggregator'}
              />
            </Row>
            <Row>
              <VendorInfoForm
                disabled={harvestVia !== 'sushi'}
                isRequired={isHarvestingStatusActive}
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
                  onChange={changeSelectedCounterVersion}
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
              form={form}
              values={values}
              required={isHarvestingStatusActive}
            />
          </section>
        </Col>
      </Row>

      <ConfirmationModal
        id="clear-report-selection-confirmation"
        open={confirmClear}
        heading={<FormattedMessage id="ui-erm-usage.udp.form.selectedReports.clearModalHeading" />}
        message={confirmationMessage}
        onConfirm={() => { confirmClearReports(true); }}
        onCancel={() => { confirmClearReports(false); }}
        confirmLabel={<FormattedMessage id="ui-erm-usage.udp.form.selectedReports.confirmClearLabel" />}
      />
    </Accordion>
  );
};

HarvestingConfigurationForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  aggregators: PropTypes.arrayOf(PropTypes.shape()),
  expanded: PropTypes.bool,
  harvesterImplementations: PropTypes.arrayOf(PropTypes.object),
  initialValues: PropTypes.object,
  form: PropTypes.shape({
    change: PropTypes.func,
    resetFieldState: PropTypes.func,
    mutators: PropTypes.shape({
      clearSelectedReports: PropTypes.func,
      setReportRelease: PropTypes.func,
    }),
  }),
  onToggle: PropTypes.func,
  values: PropTypes.shape(),
};

export default HarvestingConfigurationForm;
