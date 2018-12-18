import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  FormattedMessage
} from 'react-intl';
import {
  Button,
  Col,
  Row,
  TextField
} from '@folio/stripes/components';
import {
  Pluggable
} from '@folio/stripes/core';
import VendorName from '../VendorName';

import css from '../UDPInfo/VendorView.css';

class FindVendor extends React.Component {
  constructor(props) {
    super(props);
    const v = props.intialVendor || '';
    this.state = {
      vendor: {
        id: v.id,
        name: v.name,
      },
    };
    this.inputVendorId = v.id;
    this.inputVendorName = v.name;
  }

  selectVendor = (v) => {
    this.props.change('vendor.name', v.name);
    this.props.change('vendor.id', v.id);

    this.setState(() => {
      return { vendor: {
        id: v.id,
        name: v.name
      } };
    });
  }

  updateVendorId = () => {
    this.props.change('vendor.id', this.inputVendorId);
    this.setState(() => {
      return { vendor: {
        id: this.inputVendorId,
        name: null
      } };
    });
  }

  changeInputVendorId = (e) => {
    this.inputVendorId = e.target.value;
  }

  renderVendorName = (vendor) => {
    if (_.isEmpty(vendor.id)) {
      return null;
    }

    const name = _.isEmpty(vendor.name) ?
      <VendorName
        vendorId={vendor.id}
        stripes={this.props.stripes}
      /> :
      <div>{vendor.name}</div>;

    return (
      <div
        name="vendorName"
        className={`${css.section} ${css.active}`}
      >
        <b>
          {<FormattedMessage id="ui-erm-usage.information.vendor" />}
        </b>
        <div>{name}</div>
      </div>);
  }

  render() {
    const disableRecordCreation = true;
    const vendorName = this.renderVendorName(this.state.vendor);

    const enterVendorIdButton =
      <Button
        id="clickable-find-vendor-by-id"
        onClick={this.updateVendorId}
      >
        {<FormattedMessage id="ui-erm-usage.udp.form.findVendor.findVendorByIdButton" />}
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
              label={
                <FormattedMessage id="ui-erm-usage.udp.form.findVendor.contenVendorId">
                  {(msg) => msg + ' *'}
                </FormattedMessage>
              }
              placeholder="Enter vendor-id"
              id="vendor-id"
              name="vendor.id"
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
