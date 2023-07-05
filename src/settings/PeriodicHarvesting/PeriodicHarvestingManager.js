import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { SubmissionError } from 'redux-form';
import { injectIntl } from 'react-intl';
import { stripesConnect, IfPermission } from '@folio/stripes/core';
import {
  Callout,
  ConfirmationModal,
  IconButton,
  Pane,
  PaneMenu,
} from '@folio/stripes/components';
import moment from 'moment-timezone';
import PeriodicHarvestingForm from './PeriodicHarvestingForm';
import PeriodicHarvestingView from './PeriodicHarvestingView';
import { combineDateTime, splitDateTime } from '../../util/dateTimeProcessing';

class PeriodicHarvestingManager extends React.Component {
  static propTypes = {
    intl: PropTypes.object,
    stripes: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      config: {},
      confirming: false,
      isEditing: false,
    };

    this.endpoint = '/erm-usage-harvester/periodic';
    this.okapiUrl = props.stripes.okapi.url;
    this.httpHeaders = {
      'X-Okapi-Tenant': props.stripes.okapi.tenant,
      'X-Okapi-Token': props.stripes.store.getState().okapi.token,
    };
  }

  componentDidMount() {
    this.fetchPeriodicHarvestingConf();
  }

  fetchPeriodicHarvestingConf = () => {
    fetch(this.okapiUrl + this.endpoint, {
      headers: this.httpHeaders,
      method: 'GET',
    })
      .then((response) => {
        if (response.status < 400) {
          return response.json();
        } else if (response.status === 404) {
          return {};
        } else {
          throw new SubmissionError({
            identifier: `Error ${response.status} while fetching periodic harvesting configuration`,
            _error: 'Fetch periodic harvesting configuration failed',
          });
        }
      })
      .then((json) => {
        this.setState({
          config: json,
        });
      })
      .catch((err) => {
        this.showErrorInfo(`Error: ${err.message}`);
      });
  };

  savePeriodicHarvestingConf = (formValues) => {
    const headers = {
      ...this.httpHeaders,
      'content-type': 'application/json',
    };

    const { locale, timeZone } = this.props.intl;
    const { date, time, periodicInterval } = formValues;

    const periodicConfig = {
      startAt: combineDateTime(date, time, locale, timeZone),
      periodicInterval,
    };

    fetch(this.okapiUrl + this.endpoint, {
      headers,
      method: 'POST',
      body: JSON.stringify(periodicConfig),
    })
      .then((response) => {
        if (response.status >= 400) {
          this.showErrorInfo(response);
        } else {
          this.onCloseEdit();
          this.setState({ config: periodicConfig });
          this.callout.sendCallout({
            message: this.props.intl.formatMessage({
              id: 'ui-erm-usage.settings.harvester.config.periodic.saved',
            }),
          });
        }
      })
      .catch((err) => {
        this.showErrorInfo(err.message);
      });
  };

  deletePeriodicHarvestingConf = () => {
    fetch(this.okapiUrl + this.endpoint, {
      headers: this.httpHeaders,
      method: 'DELETE',
    })
      .then((response) => {
        if (response.status < 400 || response.status === 404) {
          this.onCloseEdit();
          this.setState({ config: {} });
          this.callout.sendCallout({
            message: this.props.intl.formatMessage({
              id: 'ui-erm-usage.settings.harvester.config.periodic.deleted',
            }),
          });
        } else {
          this.showErrorInfo(response);
        }
      })
      .catch((err) => {
        this.showErrorInfo(err.message);
      });
  };

  showErrorInfo = (response) => {
    response.then((text) => {
      const msg = `Error: ${text}`;
      if (this.callout) {
        this.callout.sendCallout({
          type: 'error',
          message: msg,
        });
      }
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
        <Callout
          ref={(ref) => {
            this.callout = ref;
          }}
        />
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

export default stripesConnect(injectIntl(PeriodicHarvestingManager));
