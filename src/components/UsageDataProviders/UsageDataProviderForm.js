import React from 'react';
import PropTypes from 'prop-types';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Button from '@folio/stripes-components/lib/Button';
import stripesForm from '@folio/stripes-form';

class UsageDataProviderForm extends React.Component {
  static propTypes = {
    onCancel: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    parentResources: PropTypes.shape().isRequired
  };

  render() {
    const lastMenu =
      <PaneMenu>
        <Button
          id="id"
          type="submit"
          title="label"
          disabled="true"
          buttonStyle="primary paneHeaderNewButton"
          marginBottom0
        >
          label
        </Button>
      </PaneMenu>;

    return (
      <Paneset>
        <Pane defaultWidth="100%" dismissible onClose={this.props.onCancel} lastMenu={lastMenu}>
          <div>This is my form</div>
        </Pane>
      </Paneset>
    );
  }
}

export default stripesForm({
  form: 'form-udProvider'
})(UsageDataProviderForm);
