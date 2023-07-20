const createOkapiHeaders = ({ tenant, token } = {}) => ({
  'X-Okapi-Tenant': tenant,
  ...(token && { 'X-Okapi-Token': token }),
});

const fetchWithDefaultOptions = (okapi = {}, path = '', requestOptions = {}) => {
  const { headers, ...rest } = requestOptions;
  const mergedRequestOptions = {
    method: 'GET',
    headers: {
      ...createOkapiHeaders(okapi),
      ...headers,
    },
    credentials: 'include',
    ...rest,
  };

  const url = (okapi.url ?? '') + path;
  return fetch(url, mergedRequestOptions);
};

export default fetchWithDefaultOptions;
