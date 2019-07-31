import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { NoteViewPage } from '@folio/stripes/smart-components';

import urls from '../util/urls';
import formatNoteReferrerEntityData from '../util/formatNoteReferrerEntityData';

class NoteViewRoute extends Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  onEdit = () => {
    const { history, location, match } = this.props;

    history.replace({
      pathname: urls.noteEdit(match.params.id),
      state: location.state,
    });
  };

  navigateBack = () => {
    const { history, location } = this.props;

    if (location.state) {
      history.goBack();
    } else {
      history.push({ pathname: urls.eUsage() });
    }
  };

  render() {
    const { location, match } = this.props;

    return (
      <NoteViewPage
        entityTypeTranslationKeys={{
          'erm-usage-data-provider': 'ui-erm-usage.usage-data-provider',
        }}
        entityTypePluralizedTranslationKeys={{
          'erm-usage-data-provider': 'ui-erm-usage.usage-data-provider-pluralizable',
        }}
        navigateBack={this.navigateBack}
        onEdit={this.onEdit}
        paneHeaderAppIcon="erm-usage"
        referredEntityData={formatNoteReferrerEntityData(location.state)}
        noteId={match.params.id}
      />
    );
  }
}

export default NoteViewRoute;
