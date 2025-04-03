import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { useStripes } from '@folio/stripes/core';
import { ConfigManager } from '@folio/stripes/smart-components';

import renderWithIntl from '../../../test/jest/helpers';
import { withReduxForm } from '../../../test/jest/helpers/withReduxForm';
import { MOD_SETTINGS } from '../../util/constants';
import DisplaySettings from './DisplaySettings';

jest.mock('@folio/stripes/smart-components', () => ({
  ConfigManager: jest.fn(({ children }) => (
    <div>
      ConfigManager
      {children}
    </div>
  )),
}));

const {
  SCOPES: { EUSAGE },
  CONFIG_NAMES: { HIDE_CREDENTIALS },
} = MOD_SETTINGS;

describe('DisplaySettings', () => {
  beforeEach(() => {
    renderWithIntl(withReduxForm(<DisplaySettings label="Test Label" stripes={useStripes()} />));
  });
  it('should render correctly', () => {
    expect(ConfigManager).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'Test Label',
        scope: EUSAGE,
        configName: HIDE_CREDENTIALS,
      }),
      {},
    );
  });

  it('should call ConfigManager with correct arguments', () => {
    expect(screen.getByText('ConfigManager')).toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox', { name: 'Hide sushi credentials in detail views' });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('name', HIDE_CREDENTIALS);
  });
});
