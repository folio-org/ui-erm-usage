import { screen } from '@folio/jest-config-stripes/testing-library/react';
import renderWithIntl from '../../../../test/jest/helpers';

import SushiCredentialsView from './SushiCredentialsView';
import udp from '../../../../test/fixtures/udp';

const renderSushiCredentialsView = (usageDataProvider = udp, hideCredentials = true) => {
  const settings = [
    {
      configName: 'hide_credentials',
      enabled: true,
      value: hideCredentials,
    },
  ];
  return renderWithIntl(
    <SushiCredentialsView usageDataProvider={usageDataProvider} settings={settings} />
  );
};

describe('SushiCredentialsView', () => {
  test('renders credentials', () => {
    renderSushiCredentialsView(udp, false);

    expect(screen.getByText(udp.sushiCredentials.customerId)).toBeInTheDocument();
    expect(screen.getByText(udp.sushiCredentials.requestorId)).toBeInTheDocument();
    expect(screen.getByText(udp.sushiCredentials.apiKey)).toBeInTheDocument();
  });

  test('hides credentials', () => {
    renderSushiCredentialsView(udp, true);

    expect(screen.queryByText(udp.sushiCredentials.customerId)).not.toBeInTheDocument();
    expect(screen.queryByText(udp.sushiCredentials.requestorId)).not.toBeInTheDocument();
    expect(screen.queryByText(udp.sushiCredentials.apiKey)).not.toBeInTheDocument();
  });
});
