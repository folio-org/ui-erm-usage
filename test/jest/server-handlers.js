import { rest } from 'msw'; // msw supports graphql too!

const handlers = [
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
