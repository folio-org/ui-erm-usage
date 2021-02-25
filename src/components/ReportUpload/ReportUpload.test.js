import React from 'react';
import { screen } from '@testing-library/react';
import { useStripes } from '@folio/stripes/core';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import renderWithIntl from '../../../test/jest/helpers';

import ReportUpload from './ReportUpload';

const renderReportUpload = (stripes) => {
  return renderWithIntl(
    <MemoryRouter>
      <ReportUpload stripes={stripes} />
    </MemoryRouter>
  );
};

describe('ReportUpload', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
  });

  describe('render counter upload', () => {
    beforeEach(() => {
      renderReportUpload(stripes);
    });
    
    test('click upload counter report', async () => {
        userEvent.click(await screen.findByText('Upload counter report'));
        const heading = screen.getByRole('heading', {
            name: 'Upload counter report'
          });
        expect(heading).toBeInTheDocument();
    });

    test('click upload non-counter report', async () => {
        userEvent.click(await screen.findByText('Upload non-counter report'));
        const heading = screen.getByRole('heading', {
            name: 'Upload non-counter report'
          });
        expect(heading).toBeInTheDocument();
    });
  });
});
