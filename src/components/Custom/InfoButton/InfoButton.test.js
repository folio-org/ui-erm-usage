import React from 'react';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStripes } from '@folio/stripes/core';

import '../../../../test/jest/__mock__';
import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';
import InfoButton from './InfoButton';

jest.mock('@folio/stripes-smart-components');

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
    <InfoButton
      customReport={customReport}
      handlers={handlers}
      mutator={mutator}
      stripes={stripes}
      udpLabel={udpLabel}
    />
  );
};

describe('InfoButton', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
  });

  test('should render InfoButton', () => {
    renderInfoButton(stripes);
  });

  describe('open info modal', () => {
    beforeEach(async () => {
      renderInfoButton(stripes);
      const iconButton = screen.getByRole('button', {
        name: 'Open report info for custom report 2020 foo.',
      });
      userEvent.click(iconButton);
    });

    test('renders report info', async () => {
      expect(screen.getByText('American Chemical Society')).toBeVisible();

      const downloadButton = screen.getByRole('button', {
        name: 'Icon Download file.txt',
      });
      expect(downloadButton).toBeInTheDocument();

      userEvent.click(downloadButton);
      expect(doDownloadFile).toHaveBeenCalled();

      const deleteButton = screen.getByRole('button', {
        name: 'Icon Delete custom report',
      });
      expect(deleteButton).toBeInTheDocument();
      userEvent.click(deleteButton);

      expect(
        screen.getByText('Delete non-counter report?')
      ).toBeInTheDocument();

      const yesButton = screen.getByRole('button', {
        name: 'Yes',
      });
      await userEvent.click(yesButton);
      await waitForElementToBeRemoved(() => screen.getByText('Delete non-counter report?'));
      expect(doDeleteReport).toHaveBeenCalled();
    });
  });
});
