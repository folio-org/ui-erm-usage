import {
  rest,
  server,
} from '../testServer';

const JOBS_URL =
  'https://folio-testing-okapi.dev.folio.org/erm-usage-harvester/jobs';

// Serves `jobs` a page at a time and records every request. `available` caps the rows
// actually served, so a harvester that stops short of the total it reports can be tested.
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
