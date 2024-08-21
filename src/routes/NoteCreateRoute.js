import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Redirect } from 'react-router-dom';

import { NoteCreatePage } from '@folio/stripes/smart-components';

import urls from '../util/urls';
import formatNoteReferrerEntityData from '../util/formatNoteReferrerEntityData';

const NoteCreateRoute = ({
  history,
  location
}) => {
  const renderCreatePage = () => {
    return (
      <NoteCreatePage
        referredEntityData={formatNoteReferrerEntityData(location.state)}
        entityTypeTranslationKeys={{ 'erm-usage-data-provider': 'ui-erm-usage.usage-data-provider' }}
        paneHeaderAppIcon="erm-usage"
        domain="erm-usage"
        navigateBack={history.goBack}
      />
    );
  };

  return location.state
    ? renderCreatePage()
    : <Redirect to={urls.eUsage()} />;
};

NoteCreateRoute.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default NoteCreateRoute;
