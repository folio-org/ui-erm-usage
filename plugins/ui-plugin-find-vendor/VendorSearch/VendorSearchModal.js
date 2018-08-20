import React from 'react';
import PropTypes from 'prop-types';
import Main from '@folio/vendors/src/Main/Main';
import Modal from '@folio/stripes-components/lib/Modal';

import css from './VendorSearch.css';

export default class VendorSearchModal extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    selectVendor: PropTypes.func.isRequired,
    closeCB: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func,
    openWhen: PropTypes.bool,
    dataKey: PropTypes.string,
  }

  constructor(props) {
    super(props);

    const dataKey = props.dataKey;
    this.connectedApp = props.stripes.connect(Main, { dataKey });

    this.state = {
      error: null,
    };

    this.closeModal = this.closeModal.bind(this);
    this.passVendorOut = this.passVendorOut.bind(this);
  }

  closeModal() {
    this.props.closeCB();
    this.setState({
      error: null,
    });
  }

  passVendorOut(e, vendor) {
    this.props.selectVendor(vendor);

    if (!vendor.error) {
      this.closeModal();
    } else {
      this.setState({
        error: vendor.error,
      });
    }
  }

  render() {
    return (
      <Modal onClose={this.closeModal} size="large" open={this.props.openWhen} label="Select Vendor" dismissible>
        <div className={css.vendorSearchModal}>
          {this.state.error ? <div className={css.vendorError}>{this.state.error}</div> : null}
          <this.connectedApp {...this.props} onSelectRow={this.passVendorOut} onComponentWillUnmount={this.props.onCloseModal} showSingleResult={false} browseOnly />
        </div>
      </Modal>
    );
  }
}
