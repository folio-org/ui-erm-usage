import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { change } from 'redux-form';
import {
  Button,
  Col,
  ExpandAllButton,
  IconButton,
  Pane,
  PaneMenu,
  Paneset,
  Row
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';

import { UDPInfoForm } from '../UDPInfo';
import { HarvestingConfigurationForm } from '../HarvestingConfiguration';
import { NotesForm } from '../Notes';
import css from './UsageDataProviderForm.css';

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

  const yyyyMMRegex = /^[12]\d{3}-(0[1-9]|1[0-2])$/;
  if (!values.harvestingStart) {
    errors.harvestingStart = 'Please fill this in the format YYYY-MM to continue';
  } else if (!(yyyyMMRegex.test(values.harvestingStart))) {
    errors.harvestingStart = 'Please fill this in the format YYYY-MM to continue';
  }

  if (values.harvestingEnd) {
    if (!(yyyyMMRegex.test(values.harvestingEnd))) {
      errors.harvestingEnd = 'Please fill this in the format YYYY-MM to continue';
    } else if (new Date(values.harvestingEnd) < new Date(values.harvestingStart)) {
      errors.harvestingEnd = 'End date must be greater than start date';
    }
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
    parentResources: PropTypes.shape().isRequired,
    parentMutator: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    const useAgg = _.has(props.initialValues, 'aggregator');

    this.state = {
      sections: {
        editUDPInfo: true,
        editHarvestingConfig: false,
        editSushiCredentials: false,
        editNotes: false
      },
      useAggregator: useAgg
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

  changeFormValue = (key, value) => {
    this.props.stripes.store.dispatch(change('form-udProvider', key, value));
  }

  /**
   * If we are using an aggregator the parameters for direct fetching of vendor (serviceUrl and serviceType) shall be null.
   * If we want to fetch statistics from vendor directly, aggregator shall be null.
   */
  changeAggregatorVendor = (useAgg) => {
    this.setState({ useAggregator: useAgg });
    if (useAgg) {
      this.changeFormValue('serviceUrl', null);
      this.changeFormValue('serviceType', null);
    } else {
      this.changeFormValue('aggregator', null);
    }
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
      <form className={css.UDPFormRoot} id="form-udp" onSubmit={handleSubmit}>
        <Paneset isRoot>
          <Pane
            defaultWidth="100%"
            firstMenu={firstMenu}
            lastMenu={lastMenu}
            paneTitle={paneTitle}
          >
            <div className={css.UDPFormContent}>
              <Row end="xs">
                <Col xs>
                  <ExpandAllButton
                    id="clickable-expand-all"
                    accordionStatus={sections}
                    onToggle={this.handleExpandAll}
                  />
                </Col>
              </Row>
              <UDPInfoForm
                accordionId="editUDPInfo"
                expanded={sections.editUDPInfo}
                onToggle={this.handleSectionToggle}
                {...this.props}
              />
              <HarvestingConfigurationForm
                accordionId="editHarvestingConfig"
                expanded={sections.editHarvestingConfig}
                onToggle={this.handleSectionToggle}
                useAggregator={this.state.useAggregator}
                changeUseAggregator={this.changeAggregatorVendor}
                sushiFormExpanded={sections.editSushiCredentials}
                {...this.props}
              />
              <NotesForm
                accordionId="editNotes"
                expanded={sections.editNotes}
                onToggle={this.handleSectionToggle}
                {...this.props}
              />
            </div>
          </Pane>
        </Paneset>
      </form>
    );
  }
}

export default stripesForm({
  form: 'form-udProvider',
  navigationCheck: true,
  enableReinitialize: true,
  validate
})(UsageDataProviderForm);
