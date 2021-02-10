import React from 'react';
import { screen } from '@testing-library/react';
import renderWithIntl from '../../../../test/jest/helpers';

import SushiCredentialsView from './SushiCredentialsView';

const stubUDP = {
  id: 'ccdbb4c7-9d58-4b59-96ef-7074c34e901b',
  label: 'Test UDP',
  description: 'This is a mock udp',
  sushiCredentials: {
    customerId: 'customer123',
    requestorId: 'requestor123',
    apiKey: 'api123',
    requestorName: 'Karla Kolumna',
    requestorMail: 'kolumna@mail.com',
  },
};

const renderSushiCredentialsView = (
  usageDataProvider = stubUDP,
  hideCredentials = true
) => {
  const settings = [
    {
      configName: 'hide_credentials',
      enabled: true,
      value: hideCredentials,
    },
  ];
  return renderWithIntl(
    <SushiCredentialsView
      usageDataProvider={usageDataProvider}
      settings={settings}
    />
  );
};

describe('SushiCredentialsView', () => {
  test('renders credentials', () => {
    renderSushiCredentialsView(stubUDP, false);

    expect(
      screen.getByText(stubUDP.sushiCredentials.customerId)
    ).toBeInTheDocument();
    expect(
      screen.getByText(stubUDP.sushiCredentials.requestorId)
    ).toBeInTheDocument();
    expect(
      screen.getByText(stubUDP.sushiCredentials.apiKey)
    ).toBeInTheDocument();
  });

  test('hides credentials', () => {
    renderSushiCredentialsView(stubUDP, true);

    expect(screen.queryByText(stubUDP.sushiCredentials.customerId)).toBeNull();
    expect(
      screen.queryByText(stubUDP.sushiCredentials.requestorId)
    ).toBeNull();
    expect(screen.queryByText(stubUDP.sushiCredentials.apiKey)).toBeNull();
  });
});
