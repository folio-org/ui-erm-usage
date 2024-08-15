import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { NoteViewPage } from '@folio/stripes/smart-components';

import urls from '../util/urls';
import formatNoteReferrerEntityData from '../util/formatNoteReferrerEntityData';

const NoteViewRoute = ({
  history,
  location,
  match,
}) => {
  const onEdit = () => {
    history.replace({
      pathname: urls.noteEdit(match.params.id),
      state: location.state,
    });
  };

  const navigateBack = () => {
    if (location.state) {
      history.goBack();
    } else {
      history.push({ pathname: urls.eUsage() });
    }
  };

  return (
    <NoteViewPage
      entityTypeTranslationKeys={{ 'erm-usage-data-provider': 'ui-erm-usage.usage-data-provider' }}
      entityTypePluralizedTranslationKeys={{ 'erm-usage-data-provider': 'ui-erm-usage.usage-data-provider-pluralizable' }}
      navigateBack={navigateBack}
      onEdit={onEdit}
      paneHeaderAppIcon="erm-usage"
      referredEntityData={formatNoteReferrerEntityData(location.state)}
      noteId={match.params.id}
    />
  );
};

NoteViewRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default NoteViewRoute;
