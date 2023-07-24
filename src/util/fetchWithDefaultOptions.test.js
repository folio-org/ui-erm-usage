import fetchWithDefaultOptions from './fetchWithDefaultOptions';

const okapi = {
  tenant: 'tenant123',
  token: 'token123',
  url: 'http://localhost',
};
const path = '/somepath';
const headers = {
  'X-Okapi-Tenant': okapi.tenant,
  'X-Okapi-Token': okapi.token,
};
const credentials = 'include';
const method = 'GET';

describe('fetchWithDefaultOptions', () => {
  const mockedFetch = jest.fn().mockReturnValue({});
  global.fetch = mockedFetch;

  test('default options', () => {
    expect(fetchWithDefaultOptions()).toEqual({});
    expect(mockedFetch).toHaveBeenCalledWith('', {
      method,
      headers: { 'X-Okapi-Tenant': undefined },
      credentials,
    });

    fetchWithDefaultOptions(okapi);
    expect(mockedFetch).toHaveBeenCalledWith(okapi.url, { method, headers, credentials });

    fetchWithDefaultOptions(okapi, path);
    expect(mockedFetch).toHaveBeenCalledWith(okapi.url + path, { method, headers, credentials });

    fetchWithDefaultOptions(undefined, path);
    expect(mockedFetch).toHaveBeenCalledWith(path, {
      method,
      headers: { 'X-Okapi-Tenant': undefined },
      credentials,
    });
  });

  test('override default options', () => {
    fetchWithDefaultOptions(okapi, path, {
      method: 'POST',
      headers: { 'X-Okapi-Tenant': 'other' },
      credentials: 'omit',
    });
    expect(mockedFetch).toHaveBeenCalledWith(okapi.url + path, {
      method: 'POST',
      headers: {
        'X-Okapi-Tenant': 'other',
        'X-Okapi-Token': okapi.token,
      },
      credentials: 'omit',
    });
  });

  test('add additional options', () => {
    fetchWithDefaultOptions(okapi, path, {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(mockedFetch).toHaveBeenCalledWith(okapi.url + path, {
      method,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      credentials,
      body: JSON.stringify({}),
    });
  });
});
