import extractUUID from '../helpers/extract-uuid';

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
  // this.post('/bl-users/login', () => {
  //   return new Response(201, {
  //     'X-Okapi-Token': `myOkapiToken:${Date.now()}`
  //   }, {
  //     user: {
  //       id: 'test',
  //       username: 'testuser',
  //       personal: {
  //         lastName: 'User',
  //         firstName: 'Test',
  //         email: 'user@folio.org',
  //       }
  //     },
  //     permissions: {
  //       permissions: []
  //     }
  //   });
  // });
  this.post('/bl-users/login?expandPermissions=true&fullPermissions=true', () => {
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
    return aggregatorSettings.all();
  });
  this.get('/aggregator-settings/:id', (schema, request) => {
    return schema.aggregatorSettings.find(request.params.id).attrs;
  });
  this.get('/usage-data-providers', ({ usageDataProviders }) => {
    return usageDataProviders.all();
  });
  this.get('/usage-data-providers/:id', (schema, request) => {
    return schema.usageDataProviders.find(request.params.id).attrs;
  });
  this.get('/counter-reports', (schema, request) => {
    if (request.queryParams) {
      /*
      Pretender cuts off the query parameter. It just provides query: "(providerId" and not the actual id. Thus we need to look for the id in thr url.
      */
      const currentId = extractUUID(request.url);
      return schema.counterReports.where({ providerId: currentId });
    } else {
      return schema.counterReports.all();
    }
  });
  this.get('/counter-reports/:id', (schema, request) => {
    return schema.counterReports.find(request.params.id).attrs;
  });
}
