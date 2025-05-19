import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Button,
  Col,
  ConfirmationModal,
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
import { ViewMetaData } from '@folio/stripes/smart-components';
import { IfPermission } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';

import { UDPInfoForm } from '../UDPInfo';
import { HarvestingConfigurationForm } from '../HarvestingConfiguration';
import { endDate } from '../../util/validate';

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
  const [confirmDelete, setConfirmDelete] = useState(false);
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
      handler: handleSaveKeyCommand
    },
    {
      name: 'expandAllSections',
      handler: expandAllSections,
    },
    {
      name: 'collapseAllSections',
      handler: collapseAllSections,
    }
  ];

  const beginDelete = () => {
    setConfirmDelete(true);
  };

  const doConfirmDelete = (confirmation) => {
    if (confirmation) {
      handlers.onDelete(initialValues.id);
    } else {
      setConfirmDelete(false);
    }
  };

  const renderFirstMenu = () => {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-erm-usage.udp.form.close">
          {([ariaLabel]) => (
            <IconButton
              id="clickable-close-udp-form-x"
              onClick={handlers.onClose}
              aria-label={ariaLabel}
              icon="times"
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  };

  const renderLastMenu = () => {
    const isEditing = initialValues?.id;

    return (
      <PaneMenu>
        {isEditing && (
          <IfPermission perm="ui-erm-usage.udp.delete">
            <Button
              id="clickable-delete-udp"
              title={<FormattedMessage id="ui-erm-usage.general.delete" />}
              buttonStyle="danger"
              onClick={beginDelete}
              disabled={confirmDelete}
              marginBottom0
            >
              <FormattedMessage id="ui-erm-usage.general.delete" />
            </Button>
          </IfPermission>
        )}
      </PaneMenu>
    );
  };

  const renderPaneFooter = () => {
    const disabled = pristine || submitting;

    const startButton = (
      <Button
        data-test-udp-form-cancel-button
        marginBottom0
        id="clickable-close-udp-form"
        buttonStyle="default mega"
        onClick={handlers.onClose}
      >
        <FormattedMessage id="ui-erm-usage.udp.form.cancel" />
      </Button>
    );

    const endButton = (
      <Button
        data-test-udp-form-submit-button
        marginBottom0
        id="clickable-createnewudp"
        buttonStyle="primary mega"
        type="submit"
        onClick={handleSubmit}
        disabled={disabled}
      >
        <FormattedMessage id="stripes-components.saveAndClose" />
      </Button>
    );

    return <PaneFooter renderStart={startButton} renderEnd={endButton} />;
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

  const getConfirmationMessage = (udp) => {
    const name = udp.label || '';
    return (
      <FormattedMessage
        id="ui-erm-usage.form.delete.confirm.message"
        values={{ name }}
      />
    );
  };

  const renderFormPaneHeader = () => (
    <PaneHeader
      firstMenu={renderFirstMenu()}
      lastMenu={renderLastMenu()}
      paneTitle={initialValues.id ? initialValues.label : <FormattedMessage id="ui-erm-usage.udp.form.createUDP" />}
    />
  );

  const udp = initialValues || {};

  const footer = renderPaneFooter();

  return (
    <HasCommand commands={shortcuts}>
      <form
        className={css.UDPFormRoot}
        id="form-udp"
        onSubmit={handleSubmit}
        data-test-form-page
      >
        <Paneset isRoot>
          <Pane
            defaultWidth="100%"
            footer={footer}
            renderHeader={renderFormPaneHeader}
          >
            <div className={css.UDPFormContent}>
              <AccordionSet>
                <Row end="xs">
                  <Col xs>
                    <ExpandAllButton
                      id="clickable-expand-all"
                      accordionStatus={sections}
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
                  initialValues={initialValues}
                  onToggle={handleSectionToggle}
                  values={values}
                />
              </AccordionSet>
              <ConfirmationModal
                id="delete-udp-confirmation"
                open={confirmDelete}
                heading={
                  <FormattedMessage id="ui-erm-usage.udp.form.delete.confirm.title" />
                }
                message={getConfirmationMessage(udp)}
                onConfirm={() => {
                  doConfirmDelete(true);
                }}
                onCancel={() => {
                  doConfirmDelete(false);
                }}
              />
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
    resetFieldState: PropTypes.func,
    mutators: PropTypes.shape({
      clearSelectedReports: PropTypes.func,
      setReportRelease: PropTypes.func,
    }),
  }),
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
  }),
  initialValues: PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
    metadata: PropTypes.shape({
      createdDate: PropTypes.string,
    }),
  }),
  handleSubmit: PropTypes.func.isRequired,
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
