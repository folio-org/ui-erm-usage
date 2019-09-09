import React from 'react';
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
  constructor(props) {
    super(props);

    this.cPeriodicHarvesting = this.props.stripes.connect(PeriodicHarvestingManager);
    this.sections = [
      {
        label: 'General',
        pages: [
          {
            route: 'aggregators',
            label: 'Aggregators',
            component: AggregatorManager,
          },
          {
            route: 'displaySettings',
            label: 'Display Settings',
            component: DisplaySettings,
          },
        ],
      },
      {
        label: 'Harvester',
        pages: [
          {
            route: 'failed-attempts',
            label: 'Number of failed attempts',
            component: MaxFailedAttempts,
          },
          {
            route: 'start-harvester',
            label: 'Start harvester',
            component: StartHarvester,
          },
          {
            route: 'periodic-harvesting',
            label: 'Periodic harvesting',
            component: this.cPeriodicHarvesting,
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
