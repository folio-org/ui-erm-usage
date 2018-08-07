import React from 'react';
import Settings from '@folio/stripes-components/lib/Settings';
import GeneralSettings from './general-settings';
import AggregatorManager from './Aggregators/AggregatorManager';

/*
  STRIPES-NEW-APP
  Your app's settings pages are defined here.
  The pages "general" and "some feature" are examples. Name them however you like.
*/

export default class ErmUsageSettings extends React.Component {
  pages = [
    {
      route: 'general',
      label: this.props.stripes.intl.formatMessage({ id: 'ui-erm-usage.settings.general' }),
      component: GeneralSettings,
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
