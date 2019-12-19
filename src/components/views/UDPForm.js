import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector, getFormValues } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  IconButton,
  Pane,
  PaneFooter,
  PaneMenu,
  Paneset,
  Row
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { IfPermission } from '@folio/stripes/core';
import stripesForm from '@folio/stripes/form';

import { UDPInfoForm } from '../UDPInfo';
import { HarvestingConfigurationForm } from '../HarvestingConfiguration';

import extractHarvesterImpls from '../../util/HarvesterImpls';

import css from './UDPForm.css';

// import css from './UsageDataProviderForm.css';

class UDPForm extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      aggregators: PropTypes.array.isRequired,
      harvesterImpls: PropTypes.array.isRequired
    }).isRequired,
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
      onDelete: PropTypes.func
    }),
    initialValues: PropTypes.object,
    invalid: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    store: PropTypes.object.isRequired,
    submitting: PropTypes.bool
  };

  static defaultProps = {
    initialValues: {}
  };

  constructor(props) {
    super(props);

    this.state = {
      confirmDelete: false,
      sections: {
        editUDPInfo: true,
        editHarvestingConfig: true,
        editNotes: false
      }
    };

    // this.connectedViewMetaData = this.props.stripes.connect(ViewMetaData);

    this.handleExpandAll = this.handleExpandAll.bind(this);
  }

  getFormName() {
    return 'form-udProvider';
  }

  getCurrentFormValues = () => {
    const { store } = this.props;
    const state = store.getState();
    const formName = this.getFormName();
    return getFormValues(formName)(state) || {};
  };

  beginDelete = () => {
    this.setState({
      confirmDelete: true
    });
  };

  confirmDelete = confirmation => {
    if (confirmation) {
      this.props.handlers.onDelete();
    } else {
      this.setState({ confirmDelete: false });
    }
  };

  // deleteUDP = () => {
  //   const {
  //     parentMutator,
  //     initialValues: { id }
  //   } = this.props;
  //   parentMutator.records.DELETE({ id }).then(() => {
  //     parentMutator.query.update({
  //       _path: '/eusage',
  //       layer: null
  //     });
  //   });
  // };

  renderFirstMenu() {
    const {
      handlers: { onClose }
    } = this.props;
    return (
      <PaneMenu>
        <FormattedMessage id="ui-erm-usage.udp.form.close">
          {ariaLabel => (
            <IconButton
              id="clickable-closeudpdialog"
              onClick={onClose}
              ariaLabel={ariaLabel}
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
          <IfPermission perm="usagedataproviders.item.delete">
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
      invalid,
      pristine,
      submitting
    } = this.props;

    const disabled = pristine || submitting || invalid;

    const startButton = (
      <Button
        data-test-udp-form-cancel-button
        marginBottom0
        id="clickable-closeudpdialog"
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
        <FormattedMessage id="ui-erm-usage.udp.form.saveAndClose" />
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
    this.setState(state => {
      const newState = _.cloneDeep(state);
      newState.sections[id] = !newState.sections[id];
      return newState;
    });
  };

  getConfirmationMessage = udp => {
    const name = udp.label || '';
    return (
      <FormattedMessage
        id="ui-erm-usage.form.delete.confirm.message"
        values={{
          name
        }}
      />
    );
  };

  render() {
    const {
      initialValues,
      handleSubmit,
      data: { aggregators, harvesterImpls }
    } = this.props;
    const { confirmDelete, sections } = this.state;
    const udp = initialValues || {};
    const paneTitle = initialValues.id ? (
      initialValues.label
    ) : (
      <FormattedMessage id="ui-erm-usage.udp.form.createUDP" />
    );

    const firstMenu = this.renderFirstMenu();
    const lastMenu = this.renderLastMenu();
    const footer = this.renderPaneFooter();

    return (
      <form
        className={css.UDPFormRoot}
        id="form-udp"
        onSubmit={handleSubmit}
        data-test-form-page
      >
        <Paneset isRoot>
          <Pane
            defaultWidth="100%"
            firstMenu={firstMenu}
            footer={footer}
            lastMenu={lastMenu}
            paneTitle={paneTitle}
          >
            <div className={css.UDPFormContent}>
              <Row end="xs">
                <Col xs>
                  <ExpandAllButton
                    id="clickable-expand-all"
                    accordionStatus={sections}
                    onToggle={this.handleExpandAll}
                  />
                </Col>
              </Row>
              {initialValues.metadata && initialValues.metadata.createdDate && (
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
                getFormValues={this.getCurrentFormValues}
                expanded={sections.editHarvestingConfig}
                onToggle={this.handleSectionToggle}
                harvesterImplementations={harvesterImpls}
                {...this.props}
              />
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
    );
  }
}

const selector = formValueSelector('form-udProvider');
export default stripesForm({
  form: 'form-udProvider',
  navigationCheck: true,
  enableReinitialize: true
})(
  connect(state => {
    const harvestingStatus = selector(
      state,
      'harvestingConfig.harvestingStatus'
    );
    const harvestVia = selector(state, 'harvestingConfig.harvestVia');
    const reportRelease = selector(state, 'harvestingConfig.reportRelease');
    const selectedReports = selector(
      state,
      'harvestingConfig.requestedReports'
    );
    return {
      harvestingStatus,
      harvestVia,
      reportRelease,
      selectedReports
    };
  })(UDPForm)
);
