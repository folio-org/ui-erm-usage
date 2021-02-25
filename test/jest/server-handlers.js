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
];

export default handlers;
