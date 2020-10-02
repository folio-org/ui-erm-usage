import React from 'react';
import { screen } from '@testing-library/react';
import '../../../test/jest/__mock__';
import renderWithIntl from '../../../test/jest/helpers';

import UDPInfoView from './UDPInfoView';

const STUB_UDP = {
  id: 'ccdbb4c7-9d58-4b59-96ef-7074c34e901b',
  label: 'Test UDP',
  description: 'This is a mock udp',
  metadata: {
    createdDate: '2020-09-09T09:13:03.147+0000',
    createdByUserId: 'd40ce2c6-e043-51c6-8573-b3d953bf5ea6',
    updatedDate: '2020-09-09T09:13:03.147+0000',
    updatedByUserId: 'd40ce2c6-e043-51c6-8573-b3d953bf5ea6',
  },
};

const STUB_UDP_NO_DESC = {
  id: 'ccdbb4c7-9d58-4b59-96ef-7074c34e901c',
  label: 'Test UDP w/o desc',
  metadata: {
    createdDate: '2020-09-09T09:13:03.147+0000',
    createdByUserId: 'd40ce2c6-e043-51c6-8573-b3d953bf5ea6',
    updatedDate: '2020-09-09T09:13:03.147+0000',
    updatedByUserId: 'd40ce2c6-e043-51c6-8573-b3d953bf5ea6',
  },
};

const renderUDPInfoView = (usageDataProvider = STUB_UDP) => (
  renderWithIntl(
    <UDPInfoView id="udpInfo" usageDataProvider={usageDataProvider} />
  ));

describe('UDPInfoView component', () => {
  it('should display description', () => {
    renderUDPInfoView(STUB_UDP);
    expect(screen.getByText('This is a mock udp')).toBeInTheDocument();
  });

  it('should display NoValue as description', () => {
    const { container } = renderUDPInfoView(STUB_UDP_NO_DESC);
    const desc = screen.queryByText('This is a mock udp');
    expect(desc).toBeNull();
    expect(container.querySelector('[data-test-no-value]')).toBeInTheDocument();
  });
});
