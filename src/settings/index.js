import PropTypes from 'prop-types';
import React from 'react';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';

import DisplaySettings from './DisplaySettings';
import ErrorHandling from './ErrorHandling/ErrorHandling';
import HarvesterLogsSettings from './HarvesterLogs';
import Harvesting from './Harvesting';
import MaxFailedAttempts from './MaxFailedAttempts';

class ErmUsageSettings extends React.Component {
  static propTypes = {
    intl: PropTypes.object,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    const {
      intl: {
        formatMessage,
      },
    } = this.props;
    this.sections = [
      {
        label: formatMessage({ id: 'ui-erm-usage.settings.general' }),
        pages: [
          {
            route: 'displaySettings',
            label: formatMessage({ id: 'ui-erm-usage.settings.section.display.settings' }),
            component: DisplaySettings,
          },
        ],
      },
      {
        label: <FormattedMessage id="ui-erm-usage.settings.harvester" />,
        pages: [
          {
            route: 'error-handling',
            label: formatMessage({ id: 'ui-erm-usage.settings.errorHandling' }),
            component: ErrorHandling,
            perm: 'ui-erm-usage.generalSettings.manage',
          },
          {
            route: 'harvesting',
            label: formatMessage({ id: 'ui-erm-usage.settings.harvesting' }),
            component: Harvesting,
            perm: 'ui-erm-usage.generalSettings.manage',
          },
          {
            route: 'failed-attempts',
            label: formatMessage({ id: 'ui-erm-usage.settings.section.number.failed' }),
            component: MaxFailedAttempts,
          },
          {
            route: 'harvester-logs',
            label: formatMessage({ id: 'ui-erm-usage.settings.harvester.logs.title' }),
            component: HarvesterLogsSettings,
          },
        ],
      },
    ];
  }

  render() {
    return (
      <Settings
        {...this.props}
        paneTitle={<FormattedMessage id="ui-erm-usage.meta.title" />}
        sections={this.sections}
      />
    );
  }
}

export default injectIntl(ErmUsageSettings);
