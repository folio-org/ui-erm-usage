import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import TextField from '@folio/stripes-components/lib/TextField';
import { Accordion } from '@folio/stripes-components/lib/Accordion';
import Pluggable from '@folio/stripes-components/lib/Pluggable';
import { Link } from 'react-router-dom';
import css from './VendorView.css';

class EditUDPInfo extends React.Component {
  constructor(props) {
    super(props);
    this.columnMapping =
    {
      name: 'Name',
      code: 'Code',
      description: 'description',
    };
    this.selectVendor = this.selectVendor.bind(this);

    this.state = {
      vendor: {},
    };
  }

  selectVendor(v) {
    this.props.change('vendorId', v.id);
    this.setState({ vendor: v });
  }

  renderSelectedVendor() {
    const disableRecordCreation = true;
    const selectedVendor = this.state.vendor;
    let vendorDiv;
    if (_.isEmpty(selectedVendor)) {
      vendorDiv =
        <div className={`${css.section} ${css.active}`}>
          Please select vendor
        </div>;
    } else {
      const path = `/vendors/view/${selectedVendor.id}`;
      vendorDiv =
        <div className={`${css.section} ${css.active}`}>
          <Link to={path}>
            <strong>{selectedVendor.name}</strong>
          </Link>
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

EditUDPInfo.propTypes = {
  initialValues: PropTypes.object,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
  accordionId: PropTypes.string.isRequired,
  change: PropTypes.func,
};

export default EditUDPInfo;
