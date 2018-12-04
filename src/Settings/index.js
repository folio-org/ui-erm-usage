import React from 'react';
import { Settings } from '@folio/stripes/smart-components';
import Harvester from './Harvester';
import AggregatorManager from './Aggregators/AggregatorManager';

/*
  STRIPES-NEW-APP
  Your app's settings pages are defined here.
  The pages "general" and "some feature" are examples. Name them however you like.
*/

export default class ErmUsageSettings extends React.Component {
  pages = [
    {
      route: 'harvester',
      label: 'Harvester',
      component: Harvester,
    },
    {
      route: 'aggregators',
      label: 'Aggregators',
      component: AggregatorManager,
    },
  ];

  render() {
    return (
      <Settings {...this.props} pages={this.pages} paneTitle="erm-usage" />
    );
  }
}
