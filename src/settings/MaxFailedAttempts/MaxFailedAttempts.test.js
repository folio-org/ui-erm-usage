import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { useStripes } from '@folio/stripes/core';
import { ConfigManager } from '@folio/stripes/smart-components';

import renderWithIntl from '../../../test/jest/helpers';
import { withReduxForm } from '../../../test/jest/helpers/withReduxForm';
import { MOD_SETTINGS } from '../../util/constants';
import MaxFailedAttempts from './MaxFailedAttempts';

jest.mock('@folio/stripes/smart-components', () => ({
  ConfigManager: jest.fn(({ children }) => (
    <div>
      ConfigManager
      {children}
    </div>
  )),
}));

const {
  SCOPES: { HARVESTER },
  CONFIG_NAMES: { MAX_FAILED_ATTEMPTS },
} = MOD_SETTINGS;

describe('MaxFailedAttempts', () => {
  beforeEach(() => {
    renderWithIntl(withReduxForm(<MaxFailedAttempts stripes={useStripes()} />));
  });

  it('should render correctly', () => {
    expect(screen.getByText('ConfigManager')).toBeInTheDocument();
    const spinbutton = screen.getByRole('spinbutton', { name: 'Number of failed attempts' });
    expect(spinbutton).toBeInTheDocument();
    expect(spinbutton).toHaveAttribute('name', MAX_FAILED_ATTEMPTS);
  });

  it('should call ConfigManager with correct arguments', () => {
    expect(ConfigManager).toHaveBeenCalledWith(
      expect.objectContaining({
        label: expect.objectContaining({
          props: expect.objectContaining({ id: 'ui-erm-usage.settings.harvester.config' }),
        }),
        scope: HARVESTER,
        configName: MAX_FAILED_ATTEMPTS,
      }),
      {},
    );
  });

  it('should correctly get the initial value', () => {
    const getInitialValues = ConfigManager.mock.calls[0][0].getInitialValues;
    expect(getInitialValues([{ value: 10 }])).toEqual({ [MAX_FAILED_ATTEMPTS]: 10 });
    expect(getInitialValues([])).toEqual({ [MAX_FAILED_ATTEMPTS]: 5 });
  });
});
