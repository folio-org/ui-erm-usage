import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Redirect } from 'react-router-dom';

import { NoteCreatePage } from '@folio/stripes/smart-components';

import urls from '../util/urls';
import formatNoteReferrerEntityData from '../util/formatNoteReferrerEntityData';

export default class NoteCreateRoute extends Component {
  static propTypes = {
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    location: ReactRouterPropTypes.location.isRequired,
  };

  renderCreatePage() {
    const { history } = this.props;

    return (
      <NoteCreatePage
        referredEntityData={formatNoteReferrerEntityData(this.props.location.state)}
        entityTypeTranslationKeys={{
          'erm-usage-data-provider': 'ui-erm-usage.usage-data-provider',
        }}
        paneHeaderAppIcon="erm-usage"
        domain="erm-usage"
        navigateBack={history.goBack}
      />
    );
  }

  render() {
    const { location } = this.props;

    return location.state
      ? this.renderCreatePage()
      : <Redirect to={urls.eUsage()} />;
  }
}
