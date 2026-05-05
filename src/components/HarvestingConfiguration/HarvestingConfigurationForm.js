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

import extractHarvesterImpls from '../../util/harvesterImpls';
import formCss from '../../util/sharedStyles/form.css';
import { AggregatorInfoForm } from './AggregatorInfo';
import {
  HarvestingEndField,
  HarvestingStartField,
  HarvestingStatusSelect,
  HarvestingViaSelect,
} from './Fields';
import SelectedReportsForm from './SelectedReports';
import { SushiCredentialsForm } from './SushiCredentials';
import { VendorInfoForm } from './VendorInfo';

const HarvestingConfigurationForm = ({
  accordionId,
  aggregators,
  expanded,
  harvesterImplementations,
  form,
  onToggle,
  values,
}) => {
  const [confirmClear, setConfirmClear] = useState(false);
  const [selectedReportRelease, setSelectedReportRelease] = useState('');
  const [previousServiceType, setPreviousServiceType] = useState(undefined);

  const serviceType = get(values, 'harvestingConfig.sushiConfig.serviceType');

  const implementations = harvesterImplementations?.length
    ? harvesterImplementations[0].implementations
    : [];

  const changeSelectedCounterVersion = (event) => {
    const selectedType = (event.target.value === '') ? undefined : event.target.value;
    form.change('harvestingConfig.sushiConfig.serviceType', selectedType);
    const impl = implementations.find(i => i.type === selectedType);
    const val = impl?.reportRelease;
    const currentReportRelease = get(values, 'harvestingConfig.reportRelease', null);

    if (currentReportRelease !== val) {
      const requestedReports = get(values, 'harvestingConfig.requestedReports', []);

      if (isEmpty(requestedReports)) {
        form.mutators.setReportRelease({}, val);
      } else {
        setPreviousServiceType(serviceType);
        setConfirmClear(true);
        setSelectedReportRelease(val);
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
    } else {
      form.change('harvestingConfig.sushiConfig.serviceType', previousServiceType);
    }

    setConfirmClear(false);
  };

  const onToggleAccordion = onToggle;
  const harvestVia = get(values, 'harvestingConfig.harvestVia', '');
  const isHarvestingStatusActive = get(values, 'harvestingConfig.harvestingStatus', '') === 'active';
  const isProviderStatusInactive = get(values, 'status', '') === 'inactive';
  const requestedReports = get(values, 'harvestingConfig.requestedReports', []);

  const currentImpl = implementations.find(i => i.type === serviceType);
  const supportedReports = currentImpl?.supportedReports ?? [];

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
              changeSelectedCounterVersion={changeSelectedCounterVersion}
              disabled={harvestVia !== 'sushi'}
              harvesterImpls={extractHarvesterImpls(harvesterImplementations)}
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
              <Col xs={12}>
                <SelectedReportsForm
                  required={isHarvestingStatusActive}
                  selectedReports={requestedReports}
                  supportedReports={supportedReports}
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
  onToggle: PropTypes.func,
  values: PropTypes.shape(),
};

export default HarvestingConfigurationForm;
