import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';

import MaxFailedAttempts from './MaxFailedAttempts';
import StartHarvester from './StartHarvester';
import AggregatorManager from './Aggregators/AggregatorManager';
import DisplaySettings from './DisplaySettings';
import PeriodicHarvestingManager from './PeriodicHarvesting';
import HarvesterLogsSettings from './HarvesterLogs';

/*
  STRIPES-NEW-APP
  Your app's settings pages are defined here.
  The pages "general" and "some feature" are examples. Name them however you like.
*/

class ErmUsageSettings extends React.Component {
  static propTypes = {
    intl: PropTypes.object,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired
    }).isRequired
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
            route: 'aggregators',
            label: formatMessage({ id: 'ui-erm-usage.information.aggregators' }),
            component: AggregatorManager
          },
          {
            route: 'displaySettings',
            label: formatMessage({ id: 'ui-erm-usage.settings.section.display.settings' }),
            component: DisplaySettings
          }
        ]
      },
      {
        label: <FormattedMessage id="ui-erm-usage.settings.harvester" />,
        pages: [
          {
            route: 'failed-attempts',
            label: formatMessage({ id: 'ui-erm-usage.settings.section.number.failed' }),
            component: MaxFailedAttempts
          },
          {
            route: 'start-harvester',
            label: formatMessage({ id: 'ui-erm-usage.harvester.start' }),
            component: StartHarvester
          },
          {
            route: 'periodic-harvesting',
            label: formatMessage({ id: 'ui-erm-usage.settings.harvester.config.periodic.title' }),
            component: PeriodicHarvestingManager
          },
          {
            route: 'harvester-logs',
            label: formatMessage({ id: 'ui-erm-usage.settings.harvester.logs.title' }),
            component: HarvesterLogsSettings
          },
        ]
      }
    ];
  }

  render() {
    return (
      <Settings
        {...this.props}
        sections={this.sections}
        paneTitle="erm-usage"
      />
    );
  }
}

export default injectIntl(ErmUsageSettings);
