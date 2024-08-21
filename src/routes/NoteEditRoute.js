import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';

import { NoteEditPage } from '@folio/stripes/smart-components';

import urls from '../util/urls';
import formatNoteReferrerEntityData from '../util/formatNoteReferrerEntityData';

const NoteEditRoute = ({
  history,
  location,
  match,
}) => {
  const goToNoteView = () => {
    history.replace({
      pathname: urls.noteView(match.params.id),
      state: location.state,
    });
  };

  return (
    <NoteEditPage
      referredEntityData={formatNoteReferrerEntityData(location.state)}
      entityTypeTranslationKeys={{ 'erm-usage-data-provider': 'ui-erm-usage.usage-data-provider' }}
      entityTypePluralizedTranslationKeys={{ 'erm-usage-data-provider': 'ui-erm-usage.usage-data-provider-pluralizable' }}
      paneHeaderAppIcon="erm-usage"
      domain="erm-usage"
      navigateBack={goToNoteView}
      noteId={match.params.id}
    />
  );
};

NoteEditRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default NoteEditRoute;
