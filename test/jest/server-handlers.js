import { rest } from 'msw'; // msw supports graphql too!

const handlers = [
  rest.get(
    'https://folio-testing-okapi.dev.folio.org/aggregator-settings/:aggregatorId',
    async (req, res, ctx) => {
      const { aggregatorId } = req.params;
      const aggSetting = {
        id: aggregatorId,
        label: 'German National Statistics Server',
        serviceType: 'NSS',
        serviceUrl: 'https://sushi.url-to-nss.de/Sushiservice/GetReport',
        aggregatorConfig: {
          reportRelease: '4',
          apiKey: 'xxx',
          requestorId: 'xxx',
          customerId: 'xxx',
        },
        accountConfig: {
          configType: 'Mail',
          configMail: 'accounts@example.org',
          displayContact: ['John Doe'],
        },
      };

      return res(ctx.json(aggSetting));
    }
  ),

  rest.post(
    'https://folio-testing-okapi.dev.folio.org/counter-reports/upload/provider/:udpId?overwrite=:overwrite',
    (req, res, ctx) => {
      return res(ctx.text('success'));
    }
  ),

  rest.post(
    'https://folio-testing-okapi.dev.folio.org/counter-reports/upload/provider/:udpId?overwrite=:overwrite',
    (req, res, ctx) => {
      return res(ctx.text('success'));
    }
  ),

  rest.post(
    'https://folio-testing-okapi.dev.folio.org/erm-usage/files',
    (req, res, ctx) => {
      return res(
        ctx.json({ id: '573698c4-805e-4d3e-b16f-e2f521e86534', size: 0.008 })
      );
    }
  ),

  rest.delete(
    'https://folio-testing-okapi.dev.folio.org/erm-usage/files/:fileId',
    (req, res, ctx) => {
      return res(ctx.status(204));
    }
  ),

  rest.post(
    'https://folio-testing-okapi.dev.folio.org/custom-reports',
    (req, res, ctx) => {
      return res(ctx.text('{}'));
    }
  ),

  rest.post(
    'https://folio-testing-okapi.dev.folio.org/counter-reports/reports/delete',
    (req, res, ctx) => {
      return res(ctx.status(204));
    }
  ),

  rest.delete(
    'https://folio-testing-okapi.dev.folio.org/custom-reports/:id',
    (req, res, ctx) => {
      return res(ctx.status(204));
    }
  ),
];

export default handlers;
