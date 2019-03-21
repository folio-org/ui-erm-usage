// typical mirage config export
// http://www.ember-cli-mirage.com/docs/v0.4.x/configuration/
export default function config() {
  // okapi endpoints
  this.get('/_/version', () => '0.0.0');

  this.get('_/proxy/tenants/:id/modules', []);

  this.get('/saml/check', {
    ssoEnabled: false
  });

  this.get('/configurations/entries', {
    configs: []
  });
  this.post('/bl-users/login', () => {
    return new Response(201, {
      'X-Okapi-Token': `myOkapiToken:${Date.now()}`
    }, {
      user: {
        id: 'test',
        username: 'testuser',
        personal: {
          lastName: 'User',
          firstName: 'Test',
          email: 'user@folio.org',
        }
      },
      permissions: {
        permissions: []
      }
    });
  });
  this.get('/aggregator-settings', ({ aggregatorSettings }) => {
    return aggregatorSettings.all(); // users in the second case
  });
  this.get('/usage-data-providers', ({ usageDataProviders }) => {
    return usageDataProviders.all(); // users in the second case
  });
  this.get('/counter-reports', ({ counterReports }) => {
    return counterReports.all(); // users in the second case
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
