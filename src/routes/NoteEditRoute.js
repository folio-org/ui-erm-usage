import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { NoteEditPage } from '@folio/stripes/smart-components';

import formatNoteReferrerEntityData from '../util/formatNoteReferrerEntityData';
import urls from '../util/urls';

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
      domain="erm-usage"
      entityTypePluralizedTranslationKeys={{
        'erm-usage-data-provider': 'ui-erm-usage.usage-data-provider-pluralizable',
      }}
      entityTypeTranslationKeys={{ 'erm-usage-data-provider': 'ui-erm-usage.usage-data-provider' }}
      navigateBack={goToNoteView}
      noteId={match.params.id}
      paneHeaderAppIcon="erm-usage"
      referredEntityData={formatNoteReferrerEntityData(location.state)}
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
