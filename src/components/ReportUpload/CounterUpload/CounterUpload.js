import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Loading, Modal } from '@folio/stripes/components';

import CounterUploadModal from './CounterUploadModal';

function CounterUpload({
  intl,
  onClose,
  onFail,
  onSuccess,
  open,
  stripes,
  udpId,
}) {
  const okapiUrl = stripes.okapi.url;
  const httpHeaders = Object.assign(
    {},
    {
      'X-Okapi-Tenant': stripes.okapi.tenant,
      'X-Okapi-Token': stripes.store.getState().okapi.token,
      'Content-Type': 'application/json',
    }
  );

  const [selectedFile, setSelectedFile] = useState({});
  const [values, setValues] = useState({});
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoType, setInfoType] = useState('');

  const closeInfoModal = () => {
    setShowInfoModal(false);
    setInfoType('');
  };

  const showErrorInfo = (response) => {
    response.text().then((text) => {
      if (text.includes('Report already existing')) {
        setShowInfoModal(true);
        setInfoType(CounterUpload.overwrite);
      } else {
        closeInfoModal();
        onFail(text);
      }
    });
  };

  const doUpload = async (report, doOverwrite) => {
    setValues(report);
    const json = JSON.stringify(report);

    setShowInfoModal(true);
    setInfoType(CounterUpload.upload);
    fetch(
      `${okapiUrl}/counter-reports/upload/provider/${udpId}?overwrite=${doOverwrite}`,
      {
        headers: httpHeaders,
        method: 'POST',
        body: json,
      }
    )
      .then((response) => {
        if (response.status >= 400) {
          showErrorInfo(response);
          return Promise.resolve(true);
        } else {
          setShowInfoModal(false);
          setSelectedFile({});
          onSuccess();
          return Promise.resolve(true);
        }
      })
      .catch((err) => {
        closeInfoModal();
        onFail(err.message);
      });
  };

  const uploadFile = (report) => {
    return doUpload(report, false);
  };

  const uploadFileForceOverwrite = () => {
    return doUpload(values, true);
  };

  const cancleUpload = () => {
    closeInfoModal();
  };

  const renderInfo = () => {
    if (infoType === CounterUpload.overwrite) {
      return (
        <>
          <div>
            <FormattedMessage id="ui-erm-usage.report.upload.reportExists" />
          </div>
          <Button id="overwriteYes" onClick={uploadFileForceOverwrite}>
            <FormattedMessage id="ui-erm-usage.general.yes" />
          </Button>
          <Button id="overwriteNo" onClick={cancleUpload}>
            <FormattedMessage id="ui-erm-usage.general.no" />
          </Button>
        </>
      );
    } else if (infoType === CounterUpload.upload) {
      return (
        <>
          <FormattedMessage id="ui-erm-usage.statistics.counter.upload.wait" />
          <Loading />
        </>
      );
    } else {
      return (
        <>
          <FormattedMessage id="ui-erm-usage.general.error" />
          <Button onClick={closeInfoModal}>
            <FormattedMessage id="ui-erm-usage.general.no" />
          </Button>
        </>
      );
    }
  };

  return (
    <>
      <CounterUploadModal
        open={open}
        onClose={onClose}
        onSubmit={uploadFile}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
      />
      <Modal
        open={showInfoModal}
        label={intl.formatMessage({
          id: 'ui-erm-usage.report.upload.modal.label',
        })}
        id="counterReportExists"
      >
        {renderInfo()}
      </Modal>
    </>
  );
}

// class CounterUploadModal extends React.Component {
//   constructor(props) {
//     super(props);
//     this.okapiUrl = props.stripes.okapi.url;
//     this.httpHeaders = Object.assign(
//       {},
//       {
//         'X-Okapi-Tenant': props.stripes.okapi.tenant,
//         'X-Okapi-Token': props.stripes.store.getState().okapi.token,
//         'Content-Type': 'application/json',
//       }
//     );
//     this.state = {
//       selectedFile: {},
//       showInfoModal: false,
//       infoType: '',
//     };
//   }

//   showErrorInfo = (response) => {
//     response.text().then((text) => {
//       if (text.includes('Report already existing')) {
//         this.setState({
//           showInfoModal: true,
//           infoType: CounterUpload.overwrite,
//         });
//       } else {
//         this.closeInfoModal();
//         this.props.onFail(text);
//       }
//     });
//   };

//   doUpload = (report, doOverwrite) => {
//     this.setState({ selectedFile: report });

//     const json = JSON.stringify(report);

//     this.setState({
//       showInfoModal: true,
//       infoType: CounterUpload.upload,
//     });
//     fetch(
//       `${this.okapiUrl}/counter-reports/upload/provider/${this.props.udpId}?overwrite=${doOverwrite}`,
//       {
//         headers: this.httpHeaders,
//         method: 'POST',
//         body: json,
//       }
//     )
//       .then((response) => {
//         if (response.status >= 400) {
//           this.showErrorInfo(response);
//         } else {
//           this.setState({
//             showInfoModal: false,
//             selectedFile: {},
//           });
//           this.props.onSuccess();
//         }
//       })
//       .catch((err) => {
//         this.closeInfoModal();
//         this.props.onFail(err.message);
//       });
//   };

//   closeInfoModal = () => {
//     this.setState({
//       showInfoModal: false,
//       infoType: '',
//     });
//   };

//   uploadFile = (report) => {
//     this.doUpload(report, false);
//   };

//   uploadFileForceOverwrite = () => {
//     this.doUpload(this.state.selectedFile, true);
//   };

//   cancleUpload = () => {
//     this.closeInfoModal();
//   };

//   renderInfo = () => {
//     if (this.state.infoType === CounterUpload.overwrite) {
//       return (
//         <>
//           <div>
//             <FormattedMessage id="ui-erm-usage.report.upload.reportExists" />
//           </div>
//           <Button id="overwriteYes" onClick={this.uploadFileForceOverwrite}>
//             <FormattedMessage id="ui-erm-usage.general.yes" />
//           </Button>
//           <Button id="overwriteNo" onClick={this.cancleUpload}>
//             <FormattedMessage id="ui-erm-usage.general.no" />
//           </Button>
//         </>
//       );
//     } else if (this.state.infoType === CounterUpload.upload) {
//       return (
//         <>
//           <FormattedMessage id="ui-erm-usage.statistics.counter.upload.wait" />
//           <Loading />
//         </>
//       );
//     } else {
//       return (
//         <>
//           <FormattedMessage id="ui-erm-usage.general.error" />
//           <Button onClick={this.closeInfoModal}>
//             <FormattedMessage id="ui-erm-usage.general.no" />
//           </Button>
//         </>
//       );
//     }
//   };

//   render() {
//     return (
//       <>
//         <CounterUpload
//           open={this.props.open}
//           onClose={this.props.onClose}
//           onSubmit={this.uploadFile}
//           //   stripes={this.props.stripes}
//           // handlers={this.props.handlers}
//         />
//         <Modal
//           open={this.state.showInfoModal}
//           label={this.props.intl.formatMessage({
//             id: 'ui-erm-usage.report.upload.modal.label',
//           })}
//           id="counterReportExists"
//         >
//           {this.renderInfo()}
//         </Modal>
//       </>
//     );
//   }
// }

CounterUpload.propTypes = {
  onSuccess: PropTypes.func,
  onFail: PropTypes.func,
  stripes: PropTypes.shape().isRequired,
  udpId: PropTypes.string,
  intl: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  mutators: PropTypes.shape({
    setContent: PropTypes.func,
  }),
};

export default injectIntl(CounterUpload);
