import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { NoteViewPage } from '@folio/stripes/smart-components';

import formatNoteReferrerEntityData from '../util/formatNoteReferrerEntityData';
import urls from '../util/urls';

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
      entityTypePluralizedTranslationKeys={{
        'erm-usage-data-provider': 'ui-erm-usage.usage-data-provider-pluralizable',
      }}
      entityTypeTranslationKeys={{ 'erm-usage-data-provider': 'ui-erm-usage.usage-data-provider' }}
      navigateBack={navigateBack}
      noteId={match.params.id}
      onEdit={onEdit}
      paneHeaderAppIcon="erm-usage"
      referredEntityData={formatNoteReferrerEntityData(location.state)}
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
