import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { NoteCreatePage } from '@folio/stripes/smart-components';

import formatNoteReferrerEntityData from '../util/formatNoteReferrerEntityData';
import urls from '../util/urls';

const NoteCreateRoute = ({
  history,
  location,
}) => {
  const renderCreatePage = () => {
    return (
      <NoteCreatePage
        domain="erm-usage"
        entityTypeTranslationKeys={{ 'erm-usage-data-provider': 'ui-erm-usage.usage-data-provider' }}
        navigateBack={history.goBack}
        paneHeaderAppIcon="erm-usage"
        referredEntityData={formatNoteReferrerEntityData(location.state)}
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
