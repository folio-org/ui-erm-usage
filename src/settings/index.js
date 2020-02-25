import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';
import MaxFailedAttempts from './MaxFailedAttempts';
import StartHarvester from './StartHarvester';
import AggregatorManager from './Aggregators/AggregatorManager';
import DisplaySettings from './DisplaySettings';
import PeriodicHarvestingManager from './PeriodicHarvesting';

/*
  STRIPES-NEW-APP
  Your app's settings pages are defined here.
  The pages "general" and "some feature" are examples. Name them however you like.
*/

export default class ErmUsageSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired
    }).isRequired
  };

  constructor(props) {
    super(props);

    this.cPeriodicHarvesting = this.props.stripes.connect(
      PeriodicHarvestingManager
    );
    this.sections = [
      {
        label: <FormattedMessage id="ui-erm-usage.settings.general" />,
        pages: [
          {
            route: 'aggregators',
            label: (
              <FormattedMessage id="ui-erm-usage.information.aggregators" />
            ),
            component: AggregatorManager
          },
          {
            route: 'displaySettings',
            label: (
              <FormattedMessage id="ui-erm-usage.settings.section.display.settings" />
            ),
            component: DisplaySettings
          }
        ]
      },
      {
        label: <FormattedMessage id="ui-erm-usage.settings.harvester" />,
        pages: [
          {
            route: 'failed-attempts',
            label: (
              <FormattedMessage id="ui-erm-usage.settings.section.number.failed" />
            ),
            component: MaxFailedAttempts
          },
          {
            route: 'start-harvester',
            label: <FormattedMessage id="ui-erm-usage.harvester.start" />,
            component: StartHarvester
          },
          {
            route: 'periodic-harvesting',
            label: (
              <FormattedMessage id="ui-erm-usage.settings.harvester.config.periodic.title" />
            ),
            component: this.cPeriodicHarvesting
          }
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
