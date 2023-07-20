/**
 * Builds OKAPI headers set
 *
 * @param {object} okapi
 * @return {{ 'X-Okapi-Tenant': string, 'X-Okapi-Token': string }}
 */
const createOkapiHeaders = (okapi) => {
  return {
    'X-Okapi-Tenant': okapi.tenant,
    ...(okapi.token && { 'X-Okapi-Token': okapi.token }),
  };
};
export default createOkapiHeaders;
