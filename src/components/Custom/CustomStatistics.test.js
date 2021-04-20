import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStripes } from '@folio/stripes/core';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import { Accordion } from '@folio/stripes-components';
import { MemoryRouter } from 'react-router-dom';
import renderWithIntl from '../../../test/jest/helpers';

import CustomStatistics from './CustomStatistics';

const customReports = [
  {
    id: 'f2c8a2ed-1048-4beb-9ea3-d438f334cc44',
    year: 2020,
    note: 'foo',
    fileId: '4e35efc4-c0d0-4a2c-864a-05c14e6f69ed',
    fileName: 'file.txt',
    fileSize: 8,
    providerId: 'e67924ee-aa00-454e-8fd0-c3f81339d20e',
  },
  {
    id: 'a1e1e563-1b61-4758-990d-8f007516eaac',
    year: 2020,
    note: 'link',
    providerId: 'e67924ee-aa00-454e-8fd0-c3f81339d20e',
    linkUrl: 'http://www.a.de',
  },
];

const handlers = {
  onClose: jest.fn,
  onEdit: jest.fn,
  onDownloadReportMultiMonth: jest.fn,
};

const renderCustomStatistics = (stripes) => {
  return renderWithIntl(
    <Accordion id="nonCounterStatisticsAccordion" label="NON-Counter stats">
      <CustomStatistics
        customReports={customReports}
        handlers={handlers}
        stripes={stripes}
        udpLabel="American Chemical Society"
      />
    </Accordion>
  );
};

describe('CustomStatistics', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
  });

  test('should render UDP', async () => {
    renderCustomStatistics(stripes);
    expect(screen.getByText('2020')).toBeVisible();
  });

  // describe('displays file info', () => {
  //   beforeEach(async () => {
  //     renderCustomStatistics(stripes);
  //     const expandAll = screen.getByRole('button', {
  //       name: 'Expand all years',
  //     });
  //     userEvent.click(expandAll);

  //     const reportButton = screen.getByRole('button', {
  //       name: 'Open report info for custom report 2020 foo.',
  //     });
  //     await userEvent.click(reportButton);
  //   });

  //   test('shows correct attributes', async () => {
  //     await waitFor(() =>
  //       expect(screen.getByText('American Chemical Society')).not.toBeVisible()
  //     );
  //     // expect(screen.getByText('American Chemical Society')).toBeVisible();
  //     expect(screen.getByText('foo')).toBeVisible();

  //     const downloadButton = screen.getByRole('button', {
  //       name: 'Download file.txt',
  //     });
  //     expect(downloadButton).toBeInTheDocument();

  //     const deleteButton = screen.getByRole('button', {
  //       name: 'Delete custom report',
  //     });
  //     expect(deleteButton).toBeInTheDocument();
  //   });
  // });
});
