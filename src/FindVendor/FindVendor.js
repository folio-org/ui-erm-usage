import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import TextField from '@folio/stripes-components/lib/TextField';
import Button from '@folio/stripes-components/lib/Button';
import Pluggable from '@folio/stripes-components/lib/Pluggable';
import css from '../UDPInfo/VendorView.css';
import VendorName from '../VendorName';

class FindVendor extends React.Component {
  constructor(props) {
    super(props);
    const id = props.intialVendorId || '';
    this.state = {
      vendorId: id,
    };
    this.inputVendorId = id;
  }

  changeVendorId = (id) => {
    this.props.change('vendorId', id);
    this.setState({ vendorId: id });
  }

  selectVendor = (v) => {
    this.changeVendorId(v.id);
  }

  updateVendorId = () => {
    this.changeVendorId(this.inputVendorId);
  }

  changeInputVendorId = (e) => {
    this.inputVendorId = e.target.value;
  }

  renderVendorName = (vendorId) => {
    if (_.isEmpty(vendorId)) {
      return null;
    }

    return (
      <div
        name="vendorName"
        className={`${css.section} ${css.active}`}
      >
        <b>Vendor</b>
        <VendorName
          vendorId={vendorId}
          stripes={this.props.stripes}
        />
      </div>);
  }

  renderVendorIdField = (vendorId) => {
    if (_.isEmpty(vendorId)) {
      return (
        <TextField
          placeholder="Enter vendor-id"
          onChange={this.changeInputVendorId}
          name="vendorId"
        />
      );
    } else {
      return (
        <TextField
          value={vendorId}
          onChange={this.changeInputVendorId}
          name="vendorId"
        />
      );
    }
  }

  render() {
    const disableRecordCreation = true;
    const selectedVendorId = this.state.vendorId;

    const vendorName = this.renderVendorName(selectedVendorId);
    const vendorIdField = this.renderVendorIdField(selectedVendorId);

    const button =
      <Button
        id="clickable-find-vendor-by-id"
        onClick={this.updateVendorId}
      >
        Enter
      </Button>;

    const pluggable =
      <Pluggable
        aria-haspopup="true"
        type="find-vendor"
        id="clickable-find-vendor"
        {...this.props}
        searchLabel="Vendor look-up"
        marginTop0
        searchButtonStyle="link"
        dataKey="vendor"
        selectVendor={this.selectVendor}
        onCloseModal={(modalProps) => {
          modalProps.parentMutator.query.update({
            query: '',
            filters: '',
            sort: 'Name',
          });
        }}
        visibleColumns={['name', 'code', 'description']}
        columnMapping={this.columnMapping}
        disableRecordCreation={disableRecordCreation}
      >
        <div style={{ background: 'red' }}>Plugin not found</div>
      </Pluggable>;

    return (
      <React.Fragment>
        Content Vendor Id *
        <Row>
          <Col xs={8}>
            { vendorIdField }
          </Col>
          <Col xs={4}>
            { button }
          </Col>
        </Row>
        <Row>
          { pluggable }
        </Row>
        <Row>
          { vendorName }
        </Row>
      </React.Fragment>
    );
  }
}

FindVendor.propTypes = {
  stripes: PropTypes.object,
  intialVendorId: PropTypes.string,
  change: PropTypes.func,
};

export default FindVendor;
