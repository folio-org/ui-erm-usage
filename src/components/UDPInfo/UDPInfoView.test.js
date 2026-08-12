import { screen } from '@folio/jest-config-stripes/testing-library/react';

import udp from '../../../test/fixtures/udp';
import renderWithIntl from '../../../test/jest/helpers';
import UDPInfoView from './UDPInfoView';

const renderUDPInfoView =
  (usageDataProvider = udp) => renderWithIntl(
    <UDPInfoView id="udpInfo" usageDataProvider={usageDataProvider} />
  );

describe('UDPInfoView component', () => {
  it('should display description', () => {
    renderUDPInfoView(udp);
    expect(screen.getByText('This is a mock udp')).toBeInTheDocument();
  });

  it('should display NoValue as description', () => {
    // eslint-disable-next-line no-unused-vars
    const { description, ...udpNoDesc } = udp;
    renderUDPInfoView(udpNoDesc);
    expect(screen.queryByText('This is a mock udp')).not.toBeInTheDocument();
    expect(screen.getByText('No value set')).toBeInTheDocument();
  });
});
