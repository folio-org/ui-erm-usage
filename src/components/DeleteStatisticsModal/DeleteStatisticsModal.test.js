import React from 'react';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStripes } from '@folio/stripes/core';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import renderWithIntl from '../../../test/jest/helpers';
import DeleteStatisticsModal from './DeleteStatisticsModal';

const onCloseModal = jest.fn();
const onFail = jest.fn();
const onSuccess = jest.fn();
const udpId = 'e67924ee-aa00-454e-8fd0-c3f81339d20e';
const udpLabel = 'American Chemical Society';
const handlers = {};

const counterReports = [
  {
    year: '2019',
    stats: [
      {
        10: null,
        11: null,
        12: null,
        report: 'DR',
        '03': {
          id: 'b4e281c9-24ca-4762-987e-1e45364c064a',
          downloadTime: '2021-04-15T11:46:35.917+00:00',
          release: '5',
          reportName: 'DR',
          yearMonth: '2019-03',
          providerId: 'e67924ee-aa00-454e-8fd0-c3f81339d20e',
          reportEditedManually: false,
          editReason: '',
        },
        '02': {
          id: 'fad42c38-7d65-4a9d-937c-9ff4ad270868',
          downloadTime: '2021-04-15T11:46:35.917+00:00',
          release: '5',
          reportName: 'DR',
          yearMonth: '2019-02',
          providerId: 'e67924ee-aa00-454e-8fd0-c3f81339d20e',
          reportEditedManually: false,
          editReason: '',
        },
        '01': {
          id: '72744645-2b40-44b5-9592-2bdc186a790f',
          downloadTime: '2021-04-15T11:46:35.917+00:00',
          release: '5',
          reportName: 'DR',
          yearMonth: '2019-01',
          providerId: 'e67924ee-aa00-454e-8fd0-c3f81339d20e',
          reportEditedManually: false,
          editReason: '',
        },
        '04': null,
        '05': null,
        '06': null,
        '07': null,
        '08': null,
        '09': null,
      },
    ],
  },
];

const renderDeleteStatistics = (stripes) => {
  return act(() => {
    renderWithIntl(
      <StripesContext.Provider value={stripes}>
        {/* <MemoryRouter> */}
        <DeleteStatisticsModal
          handlers={handlers}
          isStatsLoading={false}
          maxFailedAttempts={5}
          onCloseModal={onCloseModal}
          open
          onFail={onFail}
          onSuccess={onSuccess}
          providerId={udpId}
          stripes={stripes}
          counterReports={counterReports}
          udpLabel={udpLabel}
        />
        {/* </MemoryRouter> */}
      </StripesContext.Provider>
    );
  });
};

describe('DeleteStatisticsModal', () => {
  let stripes;
  beforeEach(() => {
    stripes = useStripes();
  });
  describe('render non-counter upload', () => {
    beforeEach(() => {
      renderDeleteStatistics(stripes);
      const expandAllButton = screen.getByRole('button', {
        name: 'Expand all years',
      });
      userEvent.click(expandAllButton);
    });
    test('header is rendered', async () => {
      const header = screen.getByRole('heading', {
        name: 'Delete multiple reports',
      });
      expect(header).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Delete 0 reports' })
      ).toHaveAttribute('disabled');
    });

    test('select all reports of year and type', () => {
      const selectDR = screen.getByRole('checkbox', {
        name: 'DR',
      });
      userEvent.click(selectDR);
      expect(
        screen.getByRole('button', { name: 'Delete 3 reports' })
      ).not.toHaveAttribute('disabled');
    });

    test('delete button is enabled after selecting two reports', () => {
      const idReport1 = counterReports[0].stats[0]['01'].id;
      const idReport2 = counterReports[0].stats[0]['02'].id;
      const checkBoxRepOne = screen.getByTestId(`checkbox-${idReport1}`);
      const checkBoxRepTwo = screen.getByTestId(`checkbox-${idReport2}`);
      userEvent.click(checkBoxRepOne);
      userEvent.click(checkBoxRepTwo);
      const submit = screen.getByRole('button', { name: 'Delete 2 reports' });
      expect(submit).not.toHaveAttribute('disabled');

      // userEvent.click(submit);
      // expect(onSuccess).toHaveBeenCalled();
    });
  });

  describe('check confirm dialog', () => {
    beforeEach(() => {
      renderDeleteStatistics(stripes);
      const expandAllButton = screen.getByRole('button', {
        name: 'Expand all years',
      });
      userEvent.click(expandAllButton);
      const idReport1 = counterReports[0].stats[0]['01'].id;
      const checkBoxRepOne = screen.getByTestId(`checkbox-${idReport1}`);
      userEvent.click(checkBoxRepOne);
      const submit = screen.getByRole('button', { name: 'Delete 1 report' });
      userEvent.click(submit);
    });

    test('click cancel', () => {
      expect(
        screen.getByRole('heading', {
          name: 'Are you sure to delete multiple reports?',
        })
      ).toBeVisible();
    });
  });
});
