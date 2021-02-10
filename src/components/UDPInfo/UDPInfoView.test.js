import React from 'react';
import { screen } from '@testing-library/react';
import renderWithIntl from '../../../test/jest/helpers';

import UDPInfoView from './UDPInfoView';

const stubUDP = {
  id: 'ccdbb4c7-9d58-4b59-96ef-7074c34e901b',
  label: 'Test UDP',
  description: 'This is a mock udp',
};

const stubUDPNoDesc = {
  id: 'ccdbb4c7-9d58-4b59-96ef-7074c34e901c',
  label: 'Test UDP w/o desc',
};

const renderUDPInfoView = (usageDataProvider = stubUDP) => (
  renderWithIntl(
    <UDPInfoView id="udpInfo" usageDataProvider={usageDataProvider} />
  ));

describe('UDPInfoView component', () => {
  it('should display description', () => {
    renderUDPInfoView(stubUDP);
    expect(screen.getByText('This is a mock udp')).toBeInTheDocument();
  });

  it('should display NoValue as description', () => {
    const { container } = renderUDPInfoView(stubUDPNoDesc);
    const desc = screen.queryByText('This is a mock udp');
    expect(desc).toBeNull();
    expect(container.querySelector('[data-test-no-value]')).toBeInTheDocument();
  });
});
