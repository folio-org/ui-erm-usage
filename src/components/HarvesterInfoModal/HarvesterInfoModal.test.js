import { MemoryRouter } from 'react-router-dom';
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
  test('default values', () => {
    const { container } = render();
    expect(container.innerHTML).toBe('<div></div>');
  });

  test('open == false', () => {
    const { container } = render({ open: false });
    expect(container.innerHTML).toBe('<div></div>');
  });

  test('isSuccess==true, udpLabel', () => {
    const { getByText, getByRole } = render({
      open: true,
      isSuccess: true,
      udpLabel: 'Provider123',
    });
    expect(getByText('Harvester started')).toBeInTheDocument();
    expect(getByText(/^A harvesting job for 'Provider123' has been/)).toBeInTheDocument();
    expect(getByText('Harvesting jobs')).toHaveAttribute('href', '/eusage/jobs?sort=-startedAt');
    expect(getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });

  test('isSuccess==true, no udpLabel', () => {
    const { getByText, getByRole } = render({
      open: true,
      isSuccess: true,
    });
    expect(getByText('Harvester started')).toBeInTheDocument();
    expect(getByText(/^A harvesting job has been/)).toBeInTheDocument();
    expect(getByText('Harvesting jobs')).toHaveAttribute('href', '/eusage/jobs?sort=-startedAt');
    expect(getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });

  test('isSuccess==false, udpLabel', () => {
    const { getByRole, queryByText } = render({
      open: true,
      isSuccess: false,
      udpLabel: 'Provider123',
    });
    expect(queryByText('Harvester failed to start')).toBeInTheDocument();
    expect(queryByText(/^Failed to schedule .* for 'Provider123'/)).toBeInTheDocument();
    expect(queryByText('Harvesting jobs')).toBeNull();
    expect(getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });

  test('isSuccess==false, no udpLabel', () => {
    const { getByRole, queryByText } = render({
      open: true,
      isSuccess: false,
    });
    expect(queryByText('Harvester failed to start')).toBeInTheDocument();
    expect(queryByText(/^Failed to schedule a harvesting job.$/)).toBeInTheDocument();
    expect(queryByText('Harvesting jobs')).toBeNull();
    expect(getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });
});
