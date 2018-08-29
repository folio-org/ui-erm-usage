import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import TextField from '@folio/stripes-components/lib/TextField';
import { Accordion } from '@folio/stripes-components/lib/Accordion';
import Pluggable from '@folio/stripes-components/lib/Pluggable';
import css from './VendorView.css';
import VendorName from '../VendorName';

class UDPInfoForm extends React.Component {
  constructor(props) {
    super(props);
    this.columnMapping =
    {
      name: 'Name',
      code: 'Code',
      description: 'description',
    };
    this.selectVendor = this.selectVendor.bind(this);

    const intialVendorId = props.initialValues.vendorId || '';
    this.state = {
      vendorId: intialVendorId,
    };
  }

  selectVendor(v) {
    this.props.change('vendorId', v.id);
    this.setState({ vendorId: v.id });
  }

  renderSelectedVendor() {
    const disableRecordCreation = true;
    const selectedVendorId = this.state.vendorId;
    let vendorDiv;
    if (_.isEmpty(selectedVendorId)) {
      vendorDiv =
        <div className={`${css.section} ${css.active}`}>
          Please select vendor
        </div>;
    } else {
      vendorDiv =
        <div className={`${css.section} ${css.active}`}>
          <VendorName
            vendorId={selectedVendorId}
            stripes={this.props.stripes}
          />
        </div>;
    }

    return (
      <div>
        Content Vendor *
        { vendorDiv }
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
        </Pluggable>
      </div>
    );
  }

  render() {
    const { expanded, onToggle, accordionId } = this.props;
    const vendor = this.renderSelectedVendor();

    return (
      <Accordion
        label="Usage Data Provider Information"
        open={expanded}
        id={accordionId}
        onToggle={onToggle}
      >
        <Row>
          <Col xs={8}>
            <Row>
              <Col xs={4}>
                <Field
                  label="Provider Name *"
                  placeholder="Enter a name to identify the usage data provider"
                  name="label"
                  id="addudp_providername"
                  component={TextField}
                  required
                  fullWidth
                />
              </Col>
              <Col xs={4}>
                { vendor }
              </Col>
              <Col xs={4}>
                <Field
                  label="Content Platform Id *"
                  name="platformId"
                  id="addudp_platformid"
                  placeholder="Link the content platform"
                  component={TextField}
                  required
                  fullWidth
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Accordion>
    );
  }
}

UDPInfoForm.propTypes = {
  initialValues: PropTypes.object,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
  accordionId: PropTypes.string.isRequired,
  change: PropTypes.func,
};

export default UDPInfoForm;
