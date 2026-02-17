import { MemoryRouter } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { StripesContext, useStripes } from '@folio/stripes/core';

import renderWithIntl from '../../../test/jest/helpers';
import { MOD_SETTINGS } from '../../util/constants';
import DisplaySettings from './DisplaySettings';

const renderDisplaySettings = (stripes, resources) => {
  if (resources) {
    stripes.connect =
      (Component) =>
        ({ ...props }) => {
          return <Component {...props} mutator={{}} resources={resources} />;
        };
  }
  return renderWithIntl(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <DisplaySettings label="Test Label" stripes={stripes} />
      </MemoryRouter>
    </StripesContext.Provider>
  );
};

describe('DisplaySettings', () => {
  const stripes = useStripes();
  const originalConnect = stripes.connect;

  beforeEach(() => {
    stripes.connect = originalConnect;
  });

  it('should render correctly', () => {
    renderDisplaySettings(stripes);

    expect(screen.getByRole('heading', { name: 'Test Label' })).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox', { name: 'Hide credentials in detail views' });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('name', MOD_SETTINGS.CONFIG_NAMES.HIDE_CREDENTIALS);
  });

  it('should display value from resources', () => {
    const resources = {
      settings: { records: [{ items: [{ value: 'true' }] }], hasLoaded: true },
    };

    renderDisplaySettings(stripes, resources);

    const checkbox = screen.getByRole('checkbox', { name: 'Hide credentials in detail views' });
    expect(checkbox).toBeChecked();
  });

  it('should display default value when settings are empty', () => {
    renderDisplaySettings(stripes);

    const checkbox = screen.getByRole('checkbox', { name: 'Hide credentials in detail views' });
    expect(checkbox).not.toBeChecked();
  });
});
