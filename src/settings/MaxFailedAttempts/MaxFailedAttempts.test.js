import { MemoryRouter } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { StripesContext, useStripes } from '@folio/stripes/core';

import renderWithIntl from '../../../test/jest/helpers';
import { MAX_FAILED_ATTEMPTS, MOD_SETTINGS } from '../../util/constants';
import MaxFailedAttempts from './MaxFailedAttempts';

const { CONFIG_NAMES } = MOD_SETTINGS;

const renderMaxFailedAttempts = (stripes, resources) => {
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
        <MaxFailedAttempts stripes={stripes} />
      </MemoryRouter>
    </StripesContext.Provider>
  );
};

describe('MaxFailedAttempts', () => {
  const stripes = useStripes();
  const originalConnect = stripes.connect;

  beforeEach(() => {
    stripes.connect = originalConnect;
  });

  it('should render correctly', () => {
    renderMaxFailedAttempts(stripes);

    const spinbutton = screen.getByRole('spinbutton', { name: 'Number of failed attempts' });
    expect(spinbutton).toBeInTheDocument();
    expect(spinbutton).toHaveAttribute('name', CONFIG_NAMES.MAX_FAILED_ATTEMPTS);
  });

  it('should call ConfigManager with correct arguments', () => {
    renderMaxFailedAttempts(stripes);

    expect(screen.getByRole('heading', { name: 'Harvester configuration' })).toBeInTheDocument();
    const spinbutton = screen.getByRole('spinbutton', { name: 'Number of failed attempts' });
    expect(spinbutton).toBeInTheDocument();
  });

  it('should display value from settings', () => {
    const resources = {
      settings: { records: [{ items: [{ value: '10' }] }], hasLoaded: true },
    };
    renderMaxFailedAttempts(stripes, resources);
    expect(screen.getByRole('spinbutton').valueAsNumber).toBe(10);
  });

  it('should display default value when settings are empty', () => {
    renderMaxFailedAttempts(stripes);
    expect(screen.getByRole('spinbutton').valueAsNumber).toBe(MAX_FAILED_ATTEMPTS);
  });
});
