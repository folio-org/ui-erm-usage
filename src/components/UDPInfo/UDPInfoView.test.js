import React from 'react';
import { screen } from '@testing-library/react';
import renderWithIntl from '../../../test/jest/helpers';

import UDPInfoView from './UDPInfoView';
import udp from '../../../test/fixtures/udp';

const renderUDPInfoView = (usageDataProvider = udp) => renderWithIntl(<UDPInfoView id="udpInfo" usageDataProvider={usageDataProvider} />);

describe('UDPInfoView component', () => {
  it('should display description', () => {
    renderUDPInfoView(udp);
    expect(screen.getByText('This is a mock udp')).toBeInTheDocument();
  });

  it('should display NoValue as description', () => {
    // eslint-disable-next-line no-unused-vars
    const { description, ...udpNoDesc } = udp;
    const { container } = renderUDPInfoView(udpNoDesc);
    const desc = screen.queryByText('This is a mock udp');
    expect(desc).toBeNull();
    expect(container.querySelector('[data-test-no-value]')).toBeInTheDocument();
  });
});
