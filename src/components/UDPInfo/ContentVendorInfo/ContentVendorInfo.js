import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Icon } from '@folio/stripes/components';

class ContentVendorInfo extends React.Component {
  static manifest = Object.freeze({
    vendor: {
      type: 'okapi',
      path: 'vendor/%{currentVendor.id}',
    },
    currentVendor: { id: null },
  });

  static propTypes = {
    vendorId: PropTypes.string.isRequired, // eslint-disable-line
    resources: PropTypes.shape({
      vendor: PropTypes.shape(),
    }),
    mutator: PropTypes.shape({
      currentVendor: PropTypes.shape({
        replace: PropTypes.func,
      }),
    }).isRequired,
  }

  constructor(props) {
    super(props);

    this.props.mutator.currentVendor.replace({ id: props.vendorId });
  }

  componentDidUpdate(prevProps) {
    if (this.props.vendorId !== prevProps.vendorId) {
      this.props.mutator.currentVendor.replace({ id: this.props.vendorId });
    }
  }

  render() {
    const { vendor } = this.props.resources;
    if (!vendor || !vendor.hasLoaded || vendor.records.length !== 1) {
      return <div style={{ paddingTop: '1rem' }}><Icon icon="spinner-ellipsis" width="100px" /></div>;
    } else {
      const currentVendor = vendor.records[0];
      return <Link to={`/vendors/view/${currentVendor.id}`}>{currentVendor.name}</Link>;
    }
  }
}

export default ContentVendorInfo;
