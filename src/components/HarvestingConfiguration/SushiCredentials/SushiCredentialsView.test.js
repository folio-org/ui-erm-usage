import React from 'react';
import { screen } from '@testing-library/react';
import '../../../../test/jest/__mock__';
import renderWithIntl from '../../../../test/jest/helpers';

import SushiCredentialsView from './SushiCredentialsView';

const STUB_UDP = {
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
  metadata: {
    createdDate: '2020-09-09T09:13:03.147+0000',
    createdByUserId: 'd40ce2c6-e043-51c6-8573-b3d953bf5ea6',
    updatedDate: '2020-09-09T09:13:03.147+0000',
    updatedByUserId: 'd40ce2c6-e043-51c6-8573-b3d953bf5ea6',
  },
};

const renderSushiCredentialsView = (
  usageDataProvider = STUB_UDP,
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
    renderSushiCredentialsView(STUB_UDP, false);

    expect(
      screen.getByText(STUB_UDP.sushiCredentials.customerId)
    ).toBeInTheDocument();
    expect(
      screen.getByText(STUB_UDP.sushiCredentials.requestorId)
    ).toBeInTheDocument();
    expect(
      screen.getByText(STUB_UDP.sushiCredentials.apiKey)
    ).toBeInTheDocument();
  });

  test('hides credentials', () => {
    renderSushiCredentialsView(STUB_UDP, true);

    expect(screen.queryByText(STUB_UDP.sushiCredentials.customerId)).toBeNull();
    expect(
      screen.queryByText(STUB_UDP.sushiCredentials.requestorId)
    ).toBeNull();
    expect(screen.queryByText(STUB_UDP.sushiCredentials.apiKey)).toBeNull();
  });
});
