import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  FormattedMessage
} from 'react-intl';
import {
  Button,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  IconButton,
  Pane,
  PaneMenu,
  Paneset,
  Row
} from '@folio/stripes/components';
import {
  IfPermission
} from '@folio/stripes/core';
import stripesForm from '@folio/stripes/form';

import { UDPInfoForm } from '../UDPInfo';
import { HarvestingConfigurationForm } from '../HarvestingConfiguration';
import { NotesForm } from '../Notes';
import css from './UsageDataProviderForm.css';

class UsageDataProviderForm extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func,
    }).isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    initialValues: PropTypes.object,
    parentResources: PropTypes.shape().isRequired,
    parentMutator: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      confirmDelete: false,
      sections: {
        editUDPInfo: true,
        editHarvestingConfig: true,
        editNotes: false
      },
    };

    this.handleExpandAll = this.handleExpandAll.bind(this);
  }

  beginDelete = () => {
    this.setState({
      confirmDelete: true,
    });
  }

  confirmDelete = (confirmation) => {
    if (confirmation) {
      this.deleteUDP();
    } else {
      this.setState({ confirmDelete: false });
    }
  }

  deleteUDP = () => {
    const { parentMutator, initialValues: { id } } = this.props;
    parentMutator.records.DELETE({ id }).then(() => {
      parentMutator.query.update({
        _path: '/eusage',
        layer: null
      });
    });
  }

  getAddFirstMenu() {
    const { onCancel } = this.props;
    return (
      <PaneMenu>
        <FormattedMessage id="ui-erm-usage.udp.form.close">
          { ariaLabel => (
            <IconButton
              id="clickable-closeudpdialog"
              onClick={onCancel}
              ariaLabel={ariaLabel}
              icon="times"
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  getLastMenu(id, label) {
    const { initialValues, pristine, submitting } = this.props;
    const { confirmDelete } = this.state;
    const isEditing = initialValues && initialValues.id;

    return (
      <PaneMenu>
        {isEditing &&
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
        }
        <Button
          id={id}
          type="submit"
          title={label}
          disabled={pristine || submitting}
          buttonStyle="primary paneHeaderNewButton"
          marginBottom0
        >
          {label}
        </Button>
      </PaneMenu>
    );
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
  }

  getConfirmationMessage = (udp) => {
    const name = udp.label || '';
    return (
      <FormattedMessage
        id="ui-erm-usage.form.delete.confirm.message"
        values={{
          name
        }}
      />
    );
  }

  extractHarvesterImpls = (resources) => {
    const records = (resources.harvesterImpls || {}).records || [];
    const implementations = records.length
      ? records[0].implementations
      : [];
    return implementations.map(i => ({
      value: i.type,
      label: i.name
    }));
  }

  render() {
    const { initialValues, handleSubmit, parentResources } = this.props;
    const { confirmDelete, sections } = this.state;
    const udp = initialValues || {};
    const paneTitle = initialValues.id ? initialValues.label : <FormattedMessage id="ui-erm-usage.udp.form.createUDP" />;

    const lastMenu = initialValues.id ?
      this.getLastMenu('clickable-createnewudp', <FormattedMessage id="ui-erm-usage.udp.form.updateUDP" />) :
      this.getLastMenu('clickable-createnewudp', <FormattedMessage id="ui-erm-usage.udp.form.createUDP" />);

    // const records = (parentResources.harvesterImpls || {}).records || [];
    const harvesterImpls = this.extractHarvesterImpls(parentResources);

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
            firstMenu={this.getAddFirstMenu()}
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
              <UDPInfoForm
                accordionId="editUDPInfo"
                expanded={sections.editUDPInfo}
                onToggle={this.handleSectionToggle}
                {...this.props}
              />
              <HarvestingConfigurationForm
                accordionId="editHarvestingConfig"
                expanded={sections.editHarvestingConfig}
                onToggle={this.handleSectionToggle}
                harvesterImplementations={harvesterImpls}
                {...this.props}
              />
              <NotesForm
                accordionId="editNotes"
                expanded={sections.editNotes}
                onToggle={this.handleSectionToggle}
                {...this.props}
              />
              <ConfirmationModal
                id="delete-udp-confirmation"
                open={confirmDelete}
                heading={<FormattedMessage id="ui-erm-usage.udp.form.delete.confirm.title" />}
                message={this.getConfirmationMessage(udp)}
                onConfirm={() => { this.confirmDelete(true); }}
                onCancel={() => { this.confirmDelete(false); }}
              />
            </div>
          </Pane>
        </Paneset>
      </form>
    );
  }
}

export default stripesForm({
  form: 'form-udProvider',
  navigationCheck: true,
  enableReinitialize: true
})(UsageDataProviderForm);
