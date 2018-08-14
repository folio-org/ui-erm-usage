import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import KeyValue from '@folio/stripes-components/lib/KeyValue';

class ContentVendorInfo extends React.Component {
  static manifest = Object.freeze({
    vendor: {
      type: 'okapi',
      path: 'vendor/%{ven.id}',
    },
    currentVendor: { id: null },
  });

  static propTypes = {
    vendorId: PropTypes.string.isRequired, // eslint-disable-line
    resources: PropTypes.shape({
      vendor: PropTypes.shape(),
    }),
    mutator: PropTypes.shape({
      ven: PropTypes.shape({
        replace: PropTypes.func,
      }),
    }).isRequired,
  }

  constructor(props) {
    super(props);

    this.props.mutator.ven.replace({ id: props.vendorId });
  }

  componentDidUpdate(prevProps) {
    if (this.props.vendorId !== prevProps.vendorId) {
      this.props.mutator.ven.replace({ id: this.props.vendorId });
    }
  }

  render() {
    const { vendor } = this.props.resources;
    if (!vendor || !vendor.hasLoaded || vendor.records.length !== 1) return null;
    const currentVendor = vendor.records[0];
    const vendorLink = <Link to={`/vendors/view/${currentVendor.id}`}>{currentVendor.name}</Link>;

    return (
      <KeyValue label="Content vendor" value={vendorLink} />
    );
  }
}

export default ContentVendorInfo;
