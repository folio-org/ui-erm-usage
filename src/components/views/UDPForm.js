import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
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

class UDPForm extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      aggregators: PropTypes.arrayOf(PropTypes.object).isRequired,
      harvesterImpls: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
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
    isLoading: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    store: PropTypes.object.isRequired,
    submitting: PropTypes.bool,
  };

  static defaultProps = {
    initialValues: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      confirmDelete: false,
      sections: {
        editUDPInfo: true,
        editHarvestingConfig: true,
        editNotes: false,
      },
    };

    this.shortcuts = [
      {
        name: 'save',
        handler: this.handleSaveKeyCommand
      },
      {
        name: 'expandAllSections',
        handler: this.expandAllSections,
      },
      {
        name: 'collapseAllSections',
        handler: this.collapseAllSections,
      }
    ];

    this.handleExpandAll = this.handleExpandAll.bind(this);
  }

  toggleAllSections = (expand) => {
    this.setState((curState) => {
      const newSections = expandAllFunction(curState.sections, expand);

      return {
        sections: newSections
      };
    });
  }

  expandAllSections = (e) => {
    e.preventDefault();
    this.toggleAllSections(true);
  }

  collapseAllSections = (e) => {
    e.preventDefault();
    this.toggleAllSections(false);
  }

  handleSaveKeyCommand = (e) => {
    e.preventDefault();
    this.executeSave();
  };

  executeSave() {
    const { handleSubmit, onSubmit } = this.props;

    handleSubmit(onSubmit);
  }

  getFormName() {
    return 'form-udProvider';
  }

  beginDelete = () => {
    this.setState({
      confirmDelete: true,
    });
  };

  confirmDelete = (confirmation) => {
    if (confirmation) {
      this.props.handlers.onDelete(this.props.initialValues.id);
    } else {
      this.setState({ confirmDelete: false });
    }
  };

  renderFirstMenu() {
    const {
      handlers: { onClose },
    } = this.props;
    return (
      <PaneMenu>
        <FormattedMessage id="ui-erm-usage.udp.form.close">
          {([ariaLabel]) => (
            <IconButton
              id="clickable-close-udp-form-x"
              onClick={onClose}
              aria-label={ariaLabel}
              icon="times"
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  renderLastMenu() {
    const { initialValues } = this.props;
    const { confirmDelete } = this.state;
    const isEditing = initialValues && initialValues.id;

    return (
      <PaneMenu>
        {isEditing && (
          <IfPermission perm="ui-erm-usage.udp.delete">
            <Button
              id="clickable-delete-udp"
              title={<FormattedMessage id="ui-erm-usage.general.delete" />}
              buttonStyle="danger"
              onClick={this.beginDelete}
              disabled={confirmDelete}
              marginBottom0
            >
              <FormattedMessage id="ui-erm-usage.general.delete" />
            </Button>
          </IfPermission>
        )}
      </PaneMenu>
    );
  }

  renderPaneFooter() {
    const {
      handlers: { onClose },
      handleSubmit,
      pristine,
      submitting,
    } = this.props;

    const disabled = pristine || submitting;

    const startButton = (
      <Button
        data-test-udp-form-cancel-button
        marginBottom0
        id="clickable-close-udp-form"
        buttonStyle="default mega"
        onClick={onClose}
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
  }

  handleExpandAll(sections) {
    this.setState({ sections });
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  handleSectionToggle = ({ id }) => {
    this.setState((state) => {
      const newState = _.cloneDeep(state);
      newState.sections[id] = !newState.sections[id];
      return newState;
    });
  };

  getConfirmationMessage = (udp) => {
    const name = udp.label || '';
    return (
      <FormattedMessage
        id="ui-erm-usage.form.delete.confirm.message"
        values={{
          name,
        }}
      />
    );
  };

  renderFormPaneHeader = () => (
    <PaneHeader
      firstMenu={this.renderFirstMenu()}
      lastMenu={this.renderLastMenu()}
      paneTitle={this.props.initialValues.id ? this.props.initialValues.label : <FormattedMessage id="ui-erm-usage.udp.form.createUDP" />}
    />
  );

  render() {
    const {
      initialValues,
      handleSubmit,
      data: { aggregators, harvesterImpls },
    } = this.props;
    const { confirmDelete, sections } = this.state;
    const udp = initialValues || {};

    const footer = this.renderPaneFooter();

    return (
      <HasCommand commands={this.shortcuts}>
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
              renderHeader={this.renderFormPaneHeader}
            >
              <div className={css.UDPFormContent}>
                <AccordionSet>
                  <Row end="xs">
                    <Col xs>
                      <ExpandAllButton
                        id="clickable-expand-all"
                        accordionStatus={sections}
                        onToggle={this.handleExpandAll}
                      />
                    </Col>
                  </Row>
                  {initialValues.metadata &&
                    initialValues.metadata.createdDate && (
                      <ViewMetaData metadata={initialValues.metadata} />
                  )}
                  <UDPInfoForm
                    accordionId="editUDPInfo"
                    expanded={sections.editUDPInfo}
                    onToggle={this.handleSectionToggle}
                    {...this.props}
                  />
                  <HarvestingConfigurationForm
                    accordionId="editHarvestingConfig"
                    aggregators={aggregators}
                    expanded={sections.editHarvestingConfig}
                    onToggle={this.handleSectionToggle}
                    harvesterImplementations={harvesterImpls}
                    {...this.props}
                  />
                </AccordionSet>
                <ConfirmationModal
                  id="delete-udp-confirmation"
                  open={confirmDelete}
                  heading={
                    <FormattedMessage id="ui-erm-usage.udp.form.delete.confirm.title" />
                  }
                  message={this.getConfirmationMessage(udp)}
                  onConfirm={() => {
                    this.confirmDelete(true);
                  }}
                  onCancel={() => {
                    this.confirmDelete(false);
                  }}
                />
              </div>
            </Pane>
          </Paneset>
        </form>
      </HasCommand>
    );
  }
}

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
