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
    this.httpHeaders = Object.assign(
      {},
      {
        'X-Okapi-Tenant': props.stripes.okapi.tenant,
        'X-Okapi-Token': props.stripes.store.getState().okapi.token,
      }
    );

    this.dateFormat = moment.localeData()._longDateFormat.L;
    this.timeFormat = moment.localeData()._longDateFormat.LT;

    this.timeZone = props.intl.timeZone;
  }

  componentDidMount() {
    this.fetchPeriodicHarvestingConf();
  }

  combineDateTime = (date, time) => {
    // dont transform date to different timezone
    const d = moment(date + ' 00:00:00 +0000', ['YYYY-MM-DD', 'YYYY-MM-DDTHH:mm:ss.SSSZ']);
    const t = moment(time, 'HH:mm:ss.SSSZ').tz(this.timeZone);

    t.set('year', d.year());
    t.set('month', d.month());
    t.set('date', d.date());
    return t;
  };

  splitDateTime = (dateTime) => {
    const dT = moment(dateTime);
    const splitted = dT.format('YYYY-MM-DD HH:mm:ss.SSSZZ').split(' ');
    const date = moment(splitted[0], 'YYYY-MM-DD');
    const time = moment(splitted[1], 'HH:mm:ss.SSSZZ');
    return {
      date: date.format('YYYY-MM-DD'),
      time: time.format(),
    };
  };

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

  savePeriodicHarvestingConf = (data) => {
    const headers = {
      ...this.httpHeaders,
      'content-type': 'application/json',
    };

    const dateTime = this.combineDateTime(data.startDate, data.startTime);
    data.startDate = dateTime.format();
    data.startTime = {};

    const { startDate, ...config } = data;
    const partialConfig = _.omit(config, 'startTime');
    partialConfig.startAt = startDate;
    this.setState({ config: partialConfig });

    fetch(this.okapiUrl + this.endpoint, {
      headers,
      method: 'POST',
      body: JSON.stringify(partialConfig),
    })
      .then((response) => {
        if (response.status >= 400) {
          this.showErrorInfo(response);
        } else {
          this.onCloseEdit();
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
    const periodicInterval = _.get(this.state.config, 'periodicInterval', null);
    if (periodicInterval === null) {
      return 'plus-sign';
    } else {
      return 'edit';
    }
  };

  getLastMenu() {
    const isEditing = this.state.isEditing;
    return (
      <IfPermission perm="ermusageharvester.periodic.post">
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
    const { stripes } = this.props;

    const initialVals = _.get(this.state, 'config', {}) || {};
    let dateTime = {
      date: '1999-01-01',
      time: '1970-01-01T07:00:00+00:00',
    };
    if (!_.isNil(initialVals) && initialVals.startAt !== '') {
      dateTime = this.splitDateTime(initialVals.startAt);
    }

    initialVals.startDate = dateTime.date;
    const time = moment
      .tz(dateTime.time, this.timeZone)
      .format('HH:mm:ss.SSSZZ');
    initialVals.startTime = time;

    const periodicHarvesting = this.state.isEditing ? (
      <PeriodicHarvestingForm
        initialValues={initialVals}
        onDelete={this.deletePeriodicHarvestingConf}
        onSubmit={(record) => {
          this.savePeriodicHarvestingConf(record);
        }}
        stripes={stripes}
        timeZone={this.timeZone}
      />
    ) : (
      <PeriodicHarvestingView
        initialValues={initialVals}
        timeFormat={this.timeFormat}
        timeZone={this.timeZone}
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
