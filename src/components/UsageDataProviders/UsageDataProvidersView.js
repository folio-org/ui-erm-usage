import React from 'react';
import PropTypes from 'prop-types';
import Pane from '@folio/stripes-components/lib/Pane';
import { Accordion } from '@folio/stripes-components/lib/Accordion';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import IconButton from '@folio/stripes-components/lib/IconButton';
import IfPermission from '@folio/stripes-components/lib/IfPermission';
import TitleManager from '../../../../stripes-core/src/components/TitleManager';

class UsageDataProvidersView extends React.Component {
  static manifest = Object.freeze({
    query: {},
    usageDataProvider: {
      type: 'okapi',
      path: 'usage-data-providers/:{id}',
      pk: 'id'
    }
  });

  static propTypes = {
    stripes: PropTypes
      .shape({
        hasPerm: PropTypes.func.isRequired,
        connect: PropTypes.func.isRequired,
        locale: PropTypes.string.isRequired,
        logger: PropTypes
          .shape({ log: PropTypes.func.isRequired })
          .isRequired,
        intl: PropTypes.object.isRequired
      })
      .isRequired,
    paneWidth: PropTypes.string,
    resources: PropTypes.shape({
      usageDataProvider: PropTypes.arrayOf(PropTypes.object),
      query: PropTypes.object,
    }),
    onClose: PropTypes.func,
    onEdit: PropTypes.func,
    editLink: PropTypes.string,
    notesToggle: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const logger = props.stripes.logger;
    this.log = logger.log.bind(logger);
    this.log('UDPView');
  }

  render() {
    const records = (this.props.resources.usageDataProvider || {}).records || [];
    const udp = records.length
      ? records[0]
      : {};

    const detailMenu = (
      <PaneMenu>
        <IfPermission perm={this.props.newRecordPerms}>
          <IconButton
            icon="trashBin"
            id="clickable-deleteorganization"
            style={{
            visibility: !udp
              ? 'hidden'
              : 'visible'
          }}
            onClick={() => ''}
            title="Delete Organization"
          />
        </IfPermission>
        <IconButton
          icon="comment"
          id="clickable-show-notes"
          style={{
          visibility: !udp
            ? 'hidden'
            : 'visible'
        }}
          onClick={this.props.notesToggle}
          title="Show Notes"
        />
        <IfPermission perm={this.props.newRecordPerms}>
          <IconButton
            icon="edit"
            id="clickable-editorganization"
            style={{
            visibility: !udp
              ? 'hidden'
              : 'visible'
          }}
            onClick={this.props.onEdit}
            href={this.props.editLink}
            title="Edit Organization"
          />
        </IfPermission>
      </PaneMenu>
    );

    return (
      <Pane
        id="pane-udpdetails"
        defaultWidth={this.props.paneWidth}
        paneTitle="UDP"
        lastMenu={detailMenu}
        dismissible
        onClose={this.props.onClose}
      >
        <TitleManager record={udp.label} />
        <Accordion open label="UDP Information" id="ex-1">
          {
            <Row>
              <Col xs={3}>
                <KeyValue label="Name" value={udp.label || ''} />
              </Col>
              <Col xs={3}>
                <KeyValue label="Id" value={udp.id} />
              </Col>
            </Row>
          }
        </Accordion>
      </Pane>
    );
  }
}

export default UsageDataProvidersView;
