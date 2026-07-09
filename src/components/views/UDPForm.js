import { cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Button,
  Col,
  ExpandAllButton,
  expandAllFunction,
  HasCommand,
  IconButton,
  Pane,
  PaneFooter,
  PaneHeader,
  PaneMenu,
  Paneset,
  Row,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import { ViewMetaData } from '@folio/stripes/smart-components';

import { endDate } from '../../util/validate';
import { HarvestingConfigurationForm } from '../HarvestingConfiguration';
import { UDPInfoForm } from '../UDPInfo';
import css from './UDPForm.css';

const UDPForm = ({
  data,
  form,
  handlers,
  initialValues = {},
  handleSubmit,
  onSubmit,
  pristine,
  submitting,
  values,
}) => {
  const [sections, setSections] = useState({
    editUDPInfo: true,
    editHarvestingConfig: true,
    editNotes: false,
  });

  const toggleAllSections = (expand) => {
    setSections(curState => expandAllFunction(curState, expand));
  };

  const expandAllSections = (e) => {
    e.preventDefault();
    toggleAllSections(true);
  };

  const collapseAllSections = (e) => {
    e.preventDefault();
    toggleAllSections(false);
  };

  const executeSave = () => {
    handleSubmit(onSubmit);
  };

  const handleSaveKeyCommand = (e) => {
    e.preventDefault();
    executeSave();
  };

  const shortcuts = [
    {
      name: 'save',
      handler: handleSaveKeyCommand,
    },
    {
      name: 'expandAllSections',
      handler: expandAllSections,
    },
    {
      name: 'collapseAllSections',
      handler: collapseAllSections,
    },
  ];

  const renderFirstMenu = () => {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-erm-usage.udp.form.close">
          {([ariaLabel]) => (
            <IconButton
              aria-label={ariaLabel}
              icon="times"
              id="clickable-close-udp-form-x"
              onClick={handlers.onClose}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  };

  const renderPaneFooter = () => {
    const disabled = pristine || submitting;

    const startButton = (
      <Button
        buttonStyle="default mega"
        data-test-udp-form-cancel-button
        id="clickable-close-udp-form"
        marginBottom0
        onClick={handlers.onClose}
      >
        <FormattedMessage id="ui-erm-usage.udp.form.cancel" />
      </Button>
    );

    const endButton = (
      <Button
        buttonStyle="primary mega"
        data-test-udp-form-submit-button
        disabled={disabled}
        id="clickable-createnewudp"
        marginBottom0
        onClick={handleSubmit}
        type="submit"
      >
        <FormattedMessage id="stripes-components.saveAndClose" />
      </Button>
    );

    return <PaneFooter renderEnd={endButton} renderStart={startButton} />;
  };

  const handleExpandAll = (secs) => {
    setSections(secs);
  };

  const handleSectionToggle = ({ id }) => {
    setSections(state => {
      const newState = cloneDeep(state);
      newState[id] = !newState[id];
      return newState;
    });
  };

  const renderFormPaneHeader = () => (
    <PaneHeader
      firstMenu={renderFirstMenu()}
      paneTitle={initialValues.id ? initialValues.label : <FormattedMessage id="ui-erm-usage.udp.form.createUDP" />}
    />
  );

  return (
    <HasCommand commands={shortcuts}>
      <form
        className={css.UDPFormRoot}
        data-test-form-page
        id="form-udp"
        onSubmit={handleSubmit}
      >
        <Paneset isRoot>
          <Pane
            defaultWidth="100%"
            footer={renderPaneFooter()}
            renderHeader={renderFormPaneHeader}
          >
            <div className={css.UDPFormContent}>
              <AccordionSet>
                <Row end="xs">
                  <Col xs>
                    <ExpandAllButton
                      accordionStatus={sections}
                      id="clickable-expand-all"
                      onToggle={handleExpandAll}
                    />
                  </Col>
                </Row>
                {initialValues.metadata?.createdDate && (
                  <ViewMetaData metadata={initialValues.metadata} />
                )}
                <UDPInfoForm
                  accordionId="editUDPInfo"
                  expanded={sections.editUDPInfo}
                  form={form}
                  onToggle={handleSectionToggle}
                  values={values}
                />
                <HarvestingConfigurationForm
                  accordionId="editHarvestingConfig"
                  aggregators={data.aggregators}
                  expanded={sections.editHarvestingConfig}
                  form={form}
                  harvesterImplementations={data.harvesterImpls}
                  onToggle={handleSectionToggle}
                  values={values}
                />
              </AccordionSet>
            </div>
          </Pane>
        </Paneset>
      </form>
    </HasCommand>
  );
};

UDPForm.propTypes = {
  data: PropTypes.shape({
    aggregators: PropTypes.arrayOf(PropTypes.object).isRequired,
    harvesterImpls: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  form: PropTypes.shape({
    change: PropTypes.func,
    mutators: PropTypes.shape({
      clearSelectedReports: PropTypes.func,
      setReportRelease: PropTypes.func,
    }),
    resetFieldState: PropTypes.func,
  }),
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
  }),
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
    metadata: PropTypes.shape({
      createdDate: PropTypes.string,
    }),
  }),
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  values: PropTypes.shape(),
};

export default stripesFinalForm({
  navigationCheck: true,
  enableReinitialize: true,
  mutators: {
    clearSelectedReports: (_args, state, tools) => {
      tools.changeValue(state, 'harvestingConfig.requestedReports', () => []);
    },
    setReportRelease: (args, state, tools) => {
      tools.changeValue(state, 'harvestingConfig.reportRelease', () => args[1]);
    },
  },
  subscription: {
    values: true,
    invalid: true,
  },
  validate: (values) => endDate(values),
})(UDPForm);
