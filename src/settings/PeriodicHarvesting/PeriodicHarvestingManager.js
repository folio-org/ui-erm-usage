import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { CalloutContext, IfPermission } from '@folio/stripes/core';
import {
  ConfirmationModal,
  IconButton,
  Pane,
  PaneMenu,
} from '@folio/stripes/components';
import moment from 'moment-timezone';
import PeriodicHarvestingForm from './PeriodicHarvestingForm';
import PeriodicHarvestingView from './PeriodicHarvestingView';
import { combineDateTime, splitDateTime } from '../../util/dateTimeProcessing';
import withPeriodicConfig from '../../util/hooks/withPeriodicConfig';

class PeriodicHarvestingManager extends React.Component {
  static propTypes = {
    intl: PropTypes.object,
    periodicConfig: PropTypes.object,
  };

  static contextType = CalloutContext;

  constructor(props) {
    super(props);

    this.state = {
      config: {},
      confirming: false,
      isEditing: false,
    };
  }

  componentDidMount() {
    this.fetchPeriodicHarvestingConf();
  }

  fetchPeriodicHarvestingConf = () => {
    this.props.periodicConfig.fetchConfig()
      .then((json) => {
        this.setState({
          config: json,
        });
      })
      .catch(this.showErrorInfo);
  };

  savePeriodicHarvestingConf = (formValues) => {
    const { locale, timeZone } = this.props.intl;
    const { date, time, periodicInterval } = formValues;

    const periodicConfig = {
      startAt: combineDateTime(date, time, locale, timeZone),
      periodicInterval,
    };

    this.props.periodicConfig.saveConfig(periodicConfig)
      .then(() => {
        this.onCloseEdit();
        this.setState({ config: periodicConfig });
        this.showSuccessInfo('saved');
      })
      .catch(this.showErrorInfo);
  };

  deletePeriodicHarvestingConf = () => {
    this.props.periodicConfig.deleteConfig()
      .then(() => {
        this.onCloseEdit();
        this.setState({ config: {} });
        this.showSuccessInfo('deleted');
      })
      .catch(this.showErrorInfo);
  };

  showSuccessInfo = (intlTag) => {
    this.context.sendCallout({
      type: 'success',
      message: this.props.intl.formatMessage({
        id: `ui-erm-usage.settings.harvester.config.periodic.${intlTag}`,
      }),
    });
  };

  showErrorInfo = (error) => {
    const prefix = this.props.intl.formatMessage({
      id: 'ui-erm-usage.general.error2',
    });
    this.context.sendCallout({
      type: 'error',
      message: `${prefix}: ${error.message}`,
    });
  };

  onCloseEdit = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState({ isEditing: false });
  };

  onEdit = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState({ isEditing: true });
  };

  showConfirm = () => {
    this.setState({
      confirming: true,
    });
  };

  cancelEditing = () => {
    this.setState({
      isEditing: false,
      confirming: false,
    });
  };

  hideConfirm = () => {
    this.setState({
      confirming: false,
    });
  };

  getEditIcon = () => {
    if (_.isEmpty(this.state.config)) {
      return 'plus-sign';
    } else {
      return 'edit';
    }
  };

  getLastMenu() {
    const isEditing = this.state.isEditing;
    return (
      <IfPermission perm="ui-erm-usage.generalSettings.manage">
        <PaneMenu>
          {isEditing ? (
            <IconButton
              icon="times"
              id="clickable-close-edit-config"
              onClick={this.showConfirm}
              aria-label="End Edit Config"
            />
          ) : (
            <IconButton
              icon={this.getEditIcon()}
              id="clickable-open-edit-config"
              onClick={this.onEdit}
              aria-label="Start Edit Config"
            />
          )}
        </PaneMenu>
      </IfPermission>
    );
  }

  render() {
    const { intl } = this.props;
    const periodicConfig = this.state.config;
    const startAt = periodicConfig?.startAt || moment.tz(intl.timeZone).locale(intl.locale).format();
    const dateTime = splitDateTime(startAt, intl.locale, intl.timeZone);
    const initialVals = {
      ...periodicConfig,
      ...dateTime
    };

    const periodicHarvesting = this.state.isEditing ? (
      <PeriodicHarvestingForm
        initialValues={initialVals}
        onDelete={this.deletePeriodicHarvestingConf}
        onSubmit={(record) => {
          this.savePeriodicHarvestingConf(record);
        }}
      />
    ) : (
      <PeriodicHarvestingView
        periodicConfig={periodicConfig}
      />
    );

    return (
      <React.Fragment>
        <Pane
          id="periodic-harvesting-pane"
          defaultWidth="fill"
          lastMenu={this.getLastMenu()}
          paneTitle={this.props.intl.formatMessage({
            id: 'ui-erm-usage.settings.harvester.config.periodic.title',
          })}
        >
          {periodicHarvesting}
        </Pane>
        <ConfirmationModal
          open={this.state.confirming}
          heading={this.props.intl.formatMessage({
            id: 'ui-erm-usage.general.pleaseConfirm',
          })}
          message={this.props.intl.formatMessage({
            id: 'ui-erm-usage.settings.harvester.config.periodic.edit.cancel',
          })}
          confirmLabel={this.props.intl.formatMessage({
            id: 'ui-erm-usage.general.keepEditing',
          })}
          onConfirm={this.hideConfirm}
          cancelLabel={this.props.intl.formatMessage({
            id:
              'ui-erm-usage.general.closeWithoutSave',
          })}
          onCancel={this.cancelEditing}
        />
      </React.Fragment>
    );
  }
}

export default injectIntl(withPeriodicConfig(PeriodicHarvestingManager));
