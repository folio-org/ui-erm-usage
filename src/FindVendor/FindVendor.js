import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  Button,
  Col,
  Row,
  TextField
} from '@folio/stripes/components';
import {
  Pluggable
} from '@folio/stripes/core';

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
          name="vendorIdTMP"
        />
      );
    } else {
      return (
        <TextField
          value={vendorId}
          onChange={this.changeInputVendorId}
          name="vendorIdTMP"
        />
      );
    }
  }

  render() {
    const disableRecordCreation = true;
    const selectedVendorId = this.state.vendorId;
    const vendorName = this.renderVendorName(selectedVendorId);

    const enterVendorIdButton =
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
        searchButtonStyle="default"
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
        <Row>
          <Col xs style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <Field
              label="Content Vendor Id *"
              placeholder="Enter vendor-id"
              id="vendor-id"
              name="vendorId"
              component={TextField}
              onChange={this.changeInputVendorId}
              fullWidth
            />
            <div style={{ marginLeft: '10px', top: '2px', position: 'relative' }}>
              { enterVendorIdButton }
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs>
            { pluggable }
          </Col>
        </Row>
        <Row>
          <Col xs>
            { vendorName }
          </Col>
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
