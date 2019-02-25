// typical mirage config export
// http://www.ember-cli-mirage.com/docs/v0.4.x/configuration/
export default function config() {
  this.get('/aggregator-settings', ({ aggregatorSettings }) => {
    return aggregatorSettings.all(); // users in the second case
  });
  // , {
  //   'aggregatorSettings': [
  //     {
  //       'id': '4c66b956-23a8-4418-aef6-1c35dcdaccc4',
  //       'label': 'ACM Digital Library',
  //       'serviceType': 'My Service',
  //       'serviceUrl': 'www.myaggregator.com',
  //       'aggregatorConfig': {
  //         'apiKey': 'abc',
  //         'requestorId': 'def',
  //         'customerId': 'ghi',
  //         'reportRelease': '4'
  //       },
  //       'accountConfig': {
  //         'configType': 'Manual',
  //         'configMail': 'ab@counter-stats.com',
  //         'displayContact': ['Counter Aggregator Contact', 'Tel: +49 1234 - 9876']
  //       }
  //     }
  //   ],
  //   'totalRecords': '1'
  // });
}
