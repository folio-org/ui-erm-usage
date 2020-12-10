import _ from 'lodash';
import extractUUID from '../helpers/extract-uuid';
import sortByYearAndType from '../helpers/sort-by-year-type';

// typical mirage config export
// http://www.ember-cli-mirage.com/docs/v0.4.x/configuration/
export default function config() {
  // okapi endpoints
  this.get('/_/version', () => '0.0.0');

  this.get('_/proxy/tenants/:id/modules', [
    {
      id: 'mod-erm-usage-harvester-1.4.0-SNAPSHOT',
      name: 'erm-usage-harvester',
      provides: [
        {
          id: 'erm-usage-harvester',
          version: '1.1'
        }
      ]
    }
  ]);

  this.get('/saml/check', {
    ssoEnabled: false
  });

  this.get('/configurations/entries', {
    configs: []
  });

  this.get('tags', {
    tags: [
      {
        id: 'c3799dc5-500b-44dd-8e17-2f2354cc43e3',
        label: 'urgent',
        description: 'Requires urgent attention',
        metadata: {
          createdDate: '2019-12-17T10:59:11.769+0000',
          updatedDate: '2019-12-17T10:59:11.769+0000'
        }
      },
      {
        id: 'd3c8b511-41e7-422e-a483-18778d0596e5',
        label: 'important',
        metadata: {
          createdDate: '2019-12-17T10:59:11.804+0000',
          updatedDate: '2019-12-17T10:59:11.804+0000'
        }
      }
    ],
    totalRecords: 2
  });

  this.post(
    '/bl-users/login?expandPermissions=true&fullPermissions=true',
    () => {
      return new Response(
        201,
        {
          'X-Okapi-Token': `myOkapiToken:${Date.now()}`
        },
        {
          user: {
            id: 'test',
            username: 'testuser',
            personal: {
              lastName: 'User',
              firstName: 'Test',
              email: 'user@folio.org'
            }
          },
          permissions: {
            permissions: []
          }
        }
      );
    }
  );

  this.get('/erm-usage-harvester/impl', (schema, request) => {
    if (request.queryParams.aggregator === 'false') {
      return {
        implementations: [
          {
            name: 'Counter-Sushi 4.1',
            description: 'SOAP-based implementation for CounterSushi 4.1',
            type: 'cs41',
            isAggregator: false
          },
          {
            name: 'Counter-Sushi 5.0',
            description: 'Implementation for Counter/Sushi 5',
            type: 'cs50',
            isAggregator: false
          }
        ]
      };
    } else {
      return {
        implementations: [
          {
            name: 'Nationaler Statistikserver',
            description:
              'Implementation for Germanys National Statistics Server (https://sushi.redi-bw.de).',
            type: 'NSS',
            isAggregator: true
          }
        ]
      };
    }
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
      Pretender cuts off the query parameter. It just provides query: "(udpId" and not the actual id. Thus we need to look for the id in thr url.
      */
      const currentId = extractUUID(request.url);
      return schema.counterReports.where({ providerId: currentId });
    } else {
      return schema.counterReports.all();
    }
  });
  this.get('/counter-reports/sorted/:udpId', (schema, request) => {
    if (request.queryParams) {
      /*
      Pretender cuts off the query parameter. It just provides query: "(udpId" and not the actual id. Thus we need to look for the id in thr url.
      */
      const currentId = extractUUID(request.url);
      const reports = schema.counterReports.where({ providerId: currentId });

      const sorted = sortByYearAndType(reports);

      const result = Object.create({});
      result.counterReportsPerYear = [];
      _.keys(sorted).forEach(year => {
        const byYear = sorted[year];
        const reportsPerYear = Object.create({});
        reportsPerYear.year = year;
        reportsPerYear.reportsPerType = [];
        _.keys(byYear).forEach(type => {
          const singleReportPerType = Object.create({});
          const byType = byYear[type];
          const rep = byType.map(r => r.attrs);
          singleReportPerType.reportType = type;
          singleReportPerType.counterReports = rep;
          reportsPerYear.reportsPerType.push(singleReportPerType);
        });
        result.counterReportsPerYear.push(reportsPerYear);
      });

      return result;
    } else {
      return null;
    }
  });
  this.get('/counter-reports/:id', (schema, request) => {
    return schema.counterReports.find(request.params.id).attrs;
  });

  this.get('/counter-reports/errors/codes', {
    errorCodes: ['other', '3000', '3031']
  });

  this.delete('/custom-reports/:id', (schema, request) => {
    return schema.customReports.find(request.params.id).destroy();
  });

  this.delete('/erm-usage/files/:id', (schema, request) => {
    return {};
  }, 204);

  this.get('/custom-reports', (schema, request) => {
    if (request.queryParams) {
      /*
      Pretender cuts off the query parameter. It just provides query: "(udpId" and not the actual id. Thus we need to look for the id in thr url.
      */
      const currentId = extractUUID(request.url);
      const reports = schema.customReports.where({ providerId: currentId });

      const customReports = reports.models.map(rep => {
        const r = Object.create({});
        r.id = rep.attrs.id;
        r.fileId = rep.attrs.fileId;
        r.fileName = rep.attrs.fileName;
        r.fileSize = rep.attrs.fileSize;
        r.providerId = rep.attrs.providerId;
        r.year = rep.attrs.year;
        r.note = rep.attrs.note;
        return r;
      });
      const result = Object.create({});
      result.customReports = customReports;
      return result;
    } else {
      return schema.customReports.all();
    }
  });

  this.get('/note-types');

  this.get(
    '/note-links/domain/erm-usage/type/:type/id/:id',
    ({ notes }, { params, queryParams }) => {
      if (queryParams.status === 'all') {
        return notes.all();
      }

      return notes.where(note => {
        let matches = false;

        for (let i = 0; i < note.links.length; i++) {
          if (
            note.links[i].type === params.type &&
            note.links[i].id === params.id
          ) {
            matches = true;
            if (queryParams.status === 'assigned') {
              return true;
            }
          }
        }
        if (!matches && queryParams.status === 'unassigned') {
          return true;
        }

        return false;
      });
    }
  );

  this.put(
    '/note-links/type/:type/id/:id',
    ({ notes }, { params, requestBody }) => {
      const body = JSON.parse(requestBody);

      body.notes.forEach(note => {
        const dbNote = notes.find(note.id);
        const links = [...dbNote.links];

        if (note.status === 'ASSIGNED') {
          links.push({
            id: params.id,
            type: params.type
          });
        } else {
          for (let i = 0; i < links.length; i++) {
            if (links[i].type === params.type && links[i].id === params.id) {
              links.splice(i, 1);
              break;
            }
          }
        }

        dbNote.update({ links });
      });
    }
  );

  this.post('/notes', (_, { requestBody }) => {
    const noteData = JSON.parse(requestBody);

    return this.create('note', noteData);
  });

  this.get('/notes/:id', ({ notes }, { params }) => {
    if (notes.find(params.id) !== null) {
      return notes.find(params.id).attrs;
    } else {
      return {};
    }
  });

  this.put('/notes/:id', ({ notes, noteTypes }, { params, requestBody }) => {
    const noteData = JSON.parse(requestBody);
    const noteTypeName = noteTypes.find(noteData.typeId).attrs.name;

    return notes.find(params.id).update({
      ...noteData,
      type: noteTypeName
    });
  });

  this.delete('/notes/:id', ({ notes, noteTypes }, { params }) => {
    const note = notes.find(params.id);
    const noteType = noteTypes.find(note.attrs.typeId);

    noteType.update({
      usage: {
        noteTotal: --noteType.attrs.usage.noteTotal
      }
    });

    return notes.find(params.id).destroy();
  });

  this.get('/erm-usage-harvester/periodic', ({ periodicHarvestingConfig }) => {
    if (periodicHarvestingConfig === undefined) {
      return null;
    }
    return periodicHarvestingConfig.all();
  });

  this.post('/erm-usage-harvester/periodic', (_, { requestBody }) => {
    const perdiodicConfigData = JSON.parse(requestBody);

    return this.create('periodic-harvesting-config', perdiodicConfigData);
  });
}
