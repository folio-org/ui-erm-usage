import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  FormattedMessage
} from 'react-intl';
import {
  Button,
  Col,
  ExpandAllButton,
  IconButton,
  Pane,
  PaneMenu,
  Paneset,
  Row
} from '@folio/stripes/components';
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
      sections: {
        editUDPInfo: true,
        editHarvestingConfig: true,
        editNotes: false
      },
    };

    this.handleExpandAll = this.handleExpandAll.bind(this);
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
    const { pristine, submitting } = this.props;

    return (
      <PaneMenu>
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

  render() {
    const { initialValues, handleSubmit } = this.props;
    const { sections } = this.state;
    const firstMenu = this.getAddFirstMenu();
    const paneTitle = initialValues.id ? initialValues.label : <FormattedMessage id="ui-erm-usage.udp.form.createUDP" />;
    const lastMenu = initialValues.id ?
      this.getLastMenu('clickable-createnewudp', <FormattedMessage id="ui-erm-usage.udp.form.updateUDP" />) :
      this.getLastMenu('clickable-createnewudp', <FormattedMessage id="ui-erm-usage.udp.form.createUDP" />);

    return (
      <form className={css.UDPFormRoot} id="form-udp" onSubmit={handleSubmit}>
        <Paneset isRoot>
          <Pane
            defaultWidth="100%"
            firstMenu={firstMenu}
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
                {...this.props}
              />
              <NotesForm
                accordionId="editNotes"
                expanded={sections.editNotes}
                onToggle={this.handleSectionToggle}
                {...this.props}
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
