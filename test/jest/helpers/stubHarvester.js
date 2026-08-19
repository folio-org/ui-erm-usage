import {
  rest,
  server,
} from '../testServer';

const JOBS_URL =
  'https://folio-testing-okapi.dev.folio.org/erm-usage-harvester/jobs';

const stubHarvester = (jobs = [], { available = jobs.length } = {}) => {
  const requests = [];
  const served = jobs.slice(0, available);

  server.use(
    rest.get(JOBS_URL, (req, res, ctx) => {
      const params = Object.fromEntries(req.url.searchParams);
      const offset = Number(params.offset);

      requests.push(params);

      return res(
        ctx.json({
          jobInfos: served.slice(offset, offset + Number(params.limit)),
          totalRecords: jobs.length,
        })
      );
    })
  );

  return requests;
};

export default stubHarvester;
