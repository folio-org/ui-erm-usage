import {
  useOkapiKyMutation,
  useOkapiKyQuery,
} from '@folio/stripes-leipzig-components';

import harvesterImpls from '../../test/fixtures/harvesterImpls';
import renderWithIntl from '../../test/jest/helpers';
import UDPForm from '../components/views/UDPForm';
import UDPCreateRoute from './UDPCreateRoute';

jest.mock('@folio/stripes-leipzig-components', () => ({
  useOkapiKyMutation: jest.fn(),
  useOkapiKyQuery: jest.fn(),
}));

jest.mock('../components/views/UDPForm', () => jest.fn(() => null));

const renderUDPCreateRoute = () => renderWithIntl(
  <UDPCreateRoute
    history={{ push: jest.fn() }}
    location={{ search: '' }}
  />
);

describe('UDPCreateRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useOkapiKyQuery.mockReturnValue({
      data: harvesterImpls[0],
      isLoading: false,
    });

    useOkapiKyMutation.mockReturnValue({
      useCreate: () => ({
        mutateAsync: jest.fn(),
      }),
    });
  });

  it('sets initial values from the default harvester implementation', () => {
    renderUDPCreateRoute();

    expect(UDPForm).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { harvesterImpls },
        initialValues: {
          status: 'active',
          harvestingConfig: {
            harvestingStatus: 'active',
            reportRelease: '5.1',
            sushiConfig: {
              serviceType: 'cs51',
            },
          },
        },
      }),
      expect.anything()
    );
  });
});
