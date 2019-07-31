import React, { Component } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';

import { NoteEditPage } from '@folio/stripes/smart-components';

import urls from '../util/urls';
import formatNoteReferrerEntityData from '../util/formatNoteReferrerEntityData';

export default class NoteEditRoute extends Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  goToNoteView = () => {
    const { history, location, match } = this.props;

    history.replace({
      pathname: urls.noteView(match.params.id),
      state: location.state,
    });
  }

  render() {
    const { location, match } = this.props;

    return (
      <NoteEditPage
        referredEntityData={formatNoteReferrerEntityData(location.state)}
        entityTypeTranslationKeys={{
          'erm-usage-data-provider': 'ui-erm-usage.usage-data-provider',
        }}
        entityTypePluralizedTranslationKeys={{
          'erm-usage-data-provider': 'ui-erm-usage.usage-data-provider-pluralizable',
        }}
        paneHeaderAppIcon="erm-usage"
        domain="erm-usage"
        navigateBack={this.goToNoteView}  
        noteId={match.params.id}
      />
    );
  }
}