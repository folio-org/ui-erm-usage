import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage
} from 'react-intl';
import { FieldArray } from 'redux-form';
import {
  Icon,
  Button,
  Dropdown,
  DropdownMenu,
  List,
  ConfirmationModal
} from '@folio/stripes/components';
import formCss from '../../sharedStyles/form.css';
import counterReports from './data/counterReports';
import ReportList from '../ReportList';
import css from './SelectedReportsForm.css';

class SelectedReportsForm extends React.Component {
  static propTypes = {
    initialValues: PropTypes.object,
    counterVersion: PropTypes.number,
    label: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      addReportOpen: false,
      searchTerm: '',
      confirmClear: false,
    };
    this.fields = null;
    this.counterReports = counterReports.getOptions();
  }

  componentDidUpdate(prevProps) {
    if (this.props.counterVersion !== prevProps.counterVersion) {
      if (!_.isEmpty(this.fields)) {
        this.beginClearReports();
      }
    }
  }

  beginClearReports = () => {
    this.setState({
      confirmClear: true,
    });
  }

  confirmClearReports = (confirmation) => {
    if (confirmation) {
      this.fields.removeAll();
      setTimeout(() => {
        this.forceUpdate();
      });
    }
    this.setState({ confirmClear: false });
  }

  onChangeSearch = (e) => {
    const searchTerm = e.target.value;
    this.setState({ searchTerm });
  }

  onToggleAddReport = () => {
    const isOpen = this.state.addReportOpen;
    this.setState({
      addReportOpen: !isOpen,
      searchTerm: ''
    });
  }

  addReportHandler = (report) => {
    if (_.isEmpty(this.fields.getAll())) {
      this.fields.unshift(report);
    } else if (this.fields.getAll().indexOf(report) < 0) {
      this.fields.unshift(report);
    }
    setTimeout(() => this.onToggleAddReport());
  }

  isReportAvailable = (report) => {
    return _.includes(report.value.toLowerCase(),
      this.state.searchTerm.toLowerCase());
  }

  removeReport = (index) => {
    this.fields.remove(index);
    setTimeout(() => this.forceUpdate());
  }

  renderItem = (item, index) => {
    const title = <FormattedMessage id="ui-erm-usage.udp.form.selectedReports.addReportTitle" />;
    return (
      <li key={item}>
        {item}
        <Button
          buttonStyle="fieldControl"
          align="end"
          type="button"
          id="clickable-remove-report"
          onClick={() => this.removeReport(index)}
          aria-label={item}
          title={title}
        >
          <Icon icon="hollowX" />
        </Button>
      </li>
    );
  }

  renderList = ({ fields }) => {
    this.fields = fields;
    const listFormatter = (fieldName, index) => (this.renderItem(fields.get(index), index));

    return (
      <List
        items={fields}
        itemFormatter={listFormatter}
        isEmptyMessage={<FormattedMessage id="ui-erm-usage.udp.form.selectedReports.emptyListMessage" />}
      />
    );
  }

  render() {
    const { confirmClear } = this.state;

    const counterVersion = this.props.counterVersion || this.props.initialValues.reportRelease;
    const counterReportsCurrentVersion = _.filter(this.counterReports, ['counterVersion', '' + counterVersion]);
    const availReportNames = _.filter(counterReportsCurrentVersion, this.isReportAvailable).map(f => f.value);

    const confirmationMessage = <FormattedMessage id="ui-erm-usage.udp.form.selectedReports.confirmClearMessage" />;

    const reports = (
      <ReportList
        items={availReportNames}
        onClickItem={this.addReportHandler}
        onChangeSearch={this.onChangeSearch}
        counterVersion={counterVersion}
      />
    );

    const reportsDropdownButton = (
      <Dropdown
        id="section-add-report"
        style={{ float: 'right' }}
        pullRight
        open={this.state ? this.state.addReportOpen : false}
        onToggle={this.onToggleAddReport}
      >
        <Button align="end" bottomMargin0 data-role="toggle" aria-haspopup="true" id="clickable-add-report">
          &#43;
          {' '}
          {<FormattedMessage id="ui-erm-usage.udp.form.selectedReports.addReportButton" />}
        </Button>
        <DropdownMenu
          data-role="menu"
          onToggle={this.onToggleAddReport}
        >
          {reports}
        </DropdownMenu>
      </Dropdown>
    );

    return (
      <React.Fragment>
        <div className={formCss.label}>
          {this.props.label}
        </div>
        <div className={css.reportListDropdownWrap}>
          {reportsDropdownButton}
        </div>
        <FieldArray name="requestedReports" component={this.renderList} />

        <ConfirmationModal
          id="clear-report-selection-confirmation"
          open={confirmClear}
          heading={<FormattedMessage id="ui-erm-usage.udp.form.selectedReports.clearModalHeading" />}
          message={confirmationMessage}
          onConfirm={() => { this.confirmClearReports(true); }}
          onCancel={() => { this.confirmClearReports(false); }}
          confirmLabel={<FormattedMessage id="ui-erm-usage.udp.form.selectedReports.confirmClearLabel" />}
        />
      </React.Fragment>
    );
  }
}

export default SelectedReportsForm;
