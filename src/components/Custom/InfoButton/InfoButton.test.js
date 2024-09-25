import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { StripesContext, useStripes } from '@folio/stripes/core';
import { MemoryRouter } from 'react-router-dom';

import '../../../../test/jest/__mock__';
import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';
import InfoButton from './InfoButton';

jest.mock('@folio/stripes/smart-components');

const customReport = {
  id: 'f2c8a2ed-1048-4beb-9ea3-d438f334cc44',
  year: 2020,
  note: 'foo',
  fileId: '4e35efc4-c0d0-4a2c-864a-05c14e6f69ed',
  fileName: 'file.txt',
  fileSize: 8,
  providerId: 'e67924ee-aa00-454e-8fd0-c3f81339d20e',
};

const udpLabel = 'American Chemical Society';

const doDownloadFile = jest.fn();
const handlers = {
  doDownloadFile,
};

const doDeleteReport = jest.fn(() => Promise.resolve());
const mutator = {
  customReport: {
    DELETE: doDeleteReport,
  },
};

const renderInfoButton = (stripes) => {
  return renderWithIntl(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <InfoButton
          customReport={customReport}
          handlers={handlers}
          mutator={mutator}
          stripes={stripes}
          udpLabel={udpLabel}
        />
      </MemoryRouter>
    </StripesContext.Provider>
  );
};

describe('InfoButton', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
  });

  test('has no permission', async () => {
    stripes.hasPerm = () => false;
    renderInfoButton(stripes);
    const iconButton = screen.getByRole('button', { name: /report 2020 foo/ });
    await userEvent.click(iconButton);
    expect(screen.queryByText('Delete custom report')).not.toBeInTheDocument();
  });

  test('renders report info', async () => {
    stripes.hasPerm = () => true;
    renderInfoButton(stripes);
    const iconButton = screen.getByRole('button', { name: /report 2020 foo/ });
    await userEvent.click(iconButton);
    expect(screen.getByText('American Chemical Society')).toBeVisible();

    const downloadButton = screen.getByRole('button', { name: 'Icon Download file.txt' });
    expect(downloadButton).toBeInTheDocument();

    await userEvent.click(downloadButton);
    expect(doDownloadFile).toHaveBeenCalled();

    const deleteButton = screen.getByRole('button', { name: 'Icon Delete custom report' });
    expect(deleteButton).toBeInTheDocument();

    await userEvent.click(deleteButton);
    const deleteReport = screen.getByRole('heading', { name: 'Delete report?' });
    expect(deleteReport).toBeInTheDocument();

    const yesButton = screen.getByRole('button', { name: 'Yes' });
    await userEvent.click(yesButton);
    expect(deleteReport).not.toBeInTheDocument();
    expect(doDeleteReport).toHaveBeenCalled();
  });
});
