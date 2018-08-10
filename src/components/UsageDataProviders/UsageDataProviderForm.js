import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Button from '@folio/stripes-components/lib/Button';
import IconButton from '@folio/stripes-components/lib/IconButton';
import stripesForm from '@folio/stripes-form';
import { ExpandAllButton } from '@folio/stripes-components/lib/Accordion';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';

import {
  EditUDPInfo,
  EditHarvestingConfig,
  EditSushiCredentials
} from '../EditSections';


function validate(values) {
  const errors = {};
  errors.udp = {};

  if (!values.label || !values.vendorId || !values.platformId) {
    errors.info = 'Please fill this in to continue';
  }

  if (!values.harvestingStatus) {
    errors.harvestingStatus = 'Please select a harvesting status';
  }

  if (!values.serviceType && !values.aggregator) {
    errors.aggregator = 'Please select an aggregator if harvesting via aggerator';
  }

  if (!values.aggregator && !values.serviceType) {
    errors.serviceType = 'Please select a service type if not harvesting via aggerator';
  }

  if (!values.reportRelease) {
    errors.reportRelease = 'Please select a report release';
  }

  if (!values.requestedReports || _.size(values.requestedReports) === 0) {
    errors.requestedReports = 'Please select at least one report';
  }

  if (!values.customerId || !values.requestorId) {
    errors.sushiCreds = 'Please fill this in to continue';
  }

  return errors;
}

class UsageDataProviderForm extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func,
    }).isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    initialValues: PropTypes.object,
    parentResources: PropTypes.shape().isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      sections: {
        editUDPInfo: true,
        editHarvestingConfig: true,
        editSushiCredentials: true,
      },
    };

    this.handleExpandAll = this.handleExpandAll.bind(this);
  }

  getAddFirstMenu() {
    const { onCancel } = this.props;

    return (
      <PaneMenu>
        <IconButton
          id="clickable-closeudpdialog"
          onClick={onCancel}
          title="Close new UsageDataProvider Dialog"
          ariaLabel="Close new UsageDataProvider Dialog"
          icon="closeX"
        />
      </PaneMenu>
    );
  }

  getLastMenu(id, label) {
    const { pristine, submitting } = this.props;

    return (
      <PaneMenu>
        <Button
          id={id}
          type="submit"
          title={label}
          disabled={pristine || submitting}
          buttonStyle="primary paneHeaderNewButton"
          marginBottom0
        >
          {label}
        </Button>
      </PaneMenu>
    );
  }

  handleExpandAll(sections) {
    this.setState({ sections });
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  handleSectionToggle = ({ id }) => {
    this.setState((state) => {
      const newState = _.cloneDeep(state);
      newState.sections[id] = !newState.sections[id];
      return newState;
    });
  }

  render() {
    const { initialValues, handleSubmit } = this.props;
    const { sections } = this.state;
    const firstMenu = this.getAddFirstMenu();
    const paneTitle = initialValues.id ? initialValues.label : 'Create UsageDataProvider';
    const lastMenu = initialValues.id ?
      this.getLastMenu('clickable-createnewudp', 'Update UsageDataProvider') :
      this.getLastMenu('clickable-createnewudp', 'Create UsageDataProvider');

    return (
      <form id="form-udp" onSubmit={handleSubmit}>
        <Paneset isRoot>
          <Pane defaultWidth="100%" firstMenu={firstMenu} lastMenu={lastMenu} paneTitle={paneTitle}>
            <Row end="xs">
              <Col xs>
                <ExpandAllButton accordionStatus={sections} onToggle={this.handleExpandAll} />
              </Col>
            </Row>
            <EditUDPInfo accordionId="editUDPInfo" expanded={sections.editUDPInfo} onToggle={this.handleSectionToggle} {...this.props} />
            <EditHarvestingConfig accordionId="editHarvestingConfig" expanded={sections.editHarvestingConfig} onToggle={this.handleSectionToggle} {...this.props} />
            <EditSushiCredentials accordionId="editSushiCredentials" expanded={sections.editSushiCredentials} onToggle={this.handleSectionToggle} {...this.props} />
          </Pane>
        </Paneset>
      </form>
    );
  }
}

export default stripesForm({
  form: 'form-udProvider',
  validate
})(UsageDataProviderForm);
