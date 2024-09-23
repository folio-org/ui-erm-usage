import { MemoryRouter } from 'react-router-dom';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import HarvesterInfoModal from './HarvesterInfoModal';

const render = (props) => {
  return renderWithIntl(
    <MemoryRouter>
      <HarvesterInfoModal {...props} />
    </MemoryRouter>
  );
};

describe('HarvesterInfoModal', () => {
  test('isSuccess==true, udpLabel', () => {
    render({
      open: true,
      isSuccess: true,
      udpLabel: 'Provider123',
    });
    expect(screen.getByText('Harvester started')).toBeInTheDocument();
    expect(screen.getByText(/^A harvesting job for 'Provider123' has been/)).toBeInTheDocument();
    expect(screen.getByText('Harvesting jobs')).toHaveAttribute(
      'href',
      '/eusage/jobs?sort=-startedAt'
    );
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });

  test('isSuccess==true, no udpLabel', () => {
    render({
      open: true,
      isSuccess: true,
    });
    expect(screen.getByText('Harvester started')).toBeInTheDocument();
    expect(screen.getByText(/^A harvesting job has been/)).toBeInTheDocument();
    expect(screen.getByText('Harvesting jobs')).toHaveAttribute(
      'href',
      '/eusage/jobs?sort=-startedAt'
    );
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });

  test('isSuccess==false, udpLabel', () => {
    render({
      open: true,
      isSuccess: false,
      udpLabel: 'Provider123',
    });
    expect(screen.getByText('Harvester failed to start')).toBeInTheDocument();
    expect(screen.getByText(/^Failed to schedule .* for 'Provider123'/)).toBeInTheDocument();
    expect(screen.queryByText('Harvesting jobs')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });

  test('isSuccess==false, no udpLabel', () => {
    render({
      open: true,
      isSuccess: false,
    });
    expect(screen.getByText('Harvester failed to start')).toBeInTheDocument();
    expect(screen.getByText(/^Failed to schedule a harvesting job.$/)).toBeInTheDocument();
    expect(screen.queryByText('Harvesting jobs')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });
});
