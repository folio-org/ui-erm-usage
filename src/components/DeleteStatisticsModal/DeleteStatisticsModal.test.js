import React from 'react';
import { screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { StripesContext, useStripes } from '@folio/stripes/core';
import { server, rest } from '../../../test/jest/testServer';
import renderWithIntl from '../../../test/jest/helpers';
import DeleteStatisticsModal from './DeleteStatisticsModal';

const onCloseModal = jest.fn();
const onFail = jest.fn();
const onSuccess = jest.fn();
const onDownloadReportSingleMonthRaw = jest.fn();
const udpId = 'e67924ee-aa00-454e-8fd0-c3f81339d20e';
const udpLabel = 'American Chemical Society';
const handlers = {
  onDownloadReportSingleMonthRaw,
};

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
        '04': {
          id: 'b4e281c9-24ca-4762-987e-1e45364c064b',
          downloadTime: '2021-04-15T11:46:35.917+00:00',
          release: '5',
          reportName: 'DR',
          yearMonth: '2019-04',
          providerId: 'e67924ee-aa00-454e-8fd0-c3f81339d20e',
          reportEditedManually: false,
          editReason: '',
          failedAttempts: 2,
          failedReason:
            'Report not valid: Exception{Number=1020, Severity=FATAL, Message=Client has made too many requests}',
        },
        '05': {
          id: 'b4e281c9-24ca-4762-987e-1e45364c064c',
          downloadTime: '2021-04-15T11:46:35.917+00:00',
          release: '5',
          reportName: 'DR',
          yearMonth: '2019-05',
          providerId: 'e67924ee-aa00-454e-8fd0-c3f81339d20e',
          reportEditedManually: false,
          editReason: '',
          failedAttempts: 10,
          failedReason:
            'Report not valid: Exception{Number=1020, Severity=FATAL, Message=Client has made too many requests}',
        },
        '06': null,
        '07': null,
        '08': null,
        '09': null,
      },
    ],
  },
];

const renderDeleteStatistics = (stripes) => {
  renderWithIntl(
    <StripesContext.Provider value={stripes}>
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
    </StripesContext.Provider>
  );
};

describe('DeleteStatisticsModal', () => {
  let stripes;
  beforeEach(() => {
    stripes = useStripes();
  });
  describe('render checkboxes', () => {
    beforeEach(async () => {
      renderDeleteStatistics(stripes);
      const expandAllButton = screen.getByRole('button', {
        name: 'Expand all years',
      });
      await userEvent.click(expandAllButton);
    });
    test('header is rendered', async () => {
      const header = screen.getByRole('heading', {
        name: 'Delete multiple reports',
      });
      expect(header).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Delete 0 reports' })).toBeDisabled();
    });

    test('select all reports of year and type', async () => {
      const selectDR = screen.getByRole('checkbox', {
        name: 'DR',
      });
      await userEvent.click(selectDR);
      expect(screen.getByRole('button', { name: 'Delete 5 reports' })).toBeEnabled();
    });

    test('delete button is enabled after selecting two reports', async () => {
      const idReport1 = counterReports[0].stats[0]['01'].id;
      const idReport2 = counterReports[0].stats[0]['02'].id;
      const checkBoxRepOne = screen.getByTestId(`checkbox-${idReport1}`);
      const checkBoxRepTwo = screen.getByTestId(`checkbox-${idReport2}`);
      await userEvent.click(checkBoxRepOne);
      await userEvent.click(checkBoxRepTwo);
      const submit = screen.getByRole('button', { name: 'Delete 2 reports' });
      expect(submit).toBeEnabled();

      await userEvent.click(checkBoxRepTwo);
      const submit1 = screen.getByRole('button', { name: 'Delete 1 report' });
      expect(submit1).toBeEnabled();
    });
  });

  describe('check confirm dialog', () => {
    beforeEach(async () => {
      renderDeleteStatistics(stripes);
      const expandAllButton = screen.getByRole('button', {
        name: 'Expand all years',
      });
      await userEvent.click(expandAllButton);
      const idReport1 = counterReports[0].stats[0]['01'].id;
      const checkBoxRepOne = screen.getByTestId(`checkbox-${idReport1}`);
      await userEvent.click(checkBoxRepOne);
      const submit = screen.getByRole('button', { name: 'Delete 1 report' });
      await userEvent.click(submit);
    });

    test('click cancel', async () => {
      const heading = screen.queryByRole('heading', {
        name: 'Are you sure to delete multiple reports?',
      });
      expect(heading).toBeVisible();

      const cancel = screen.getByRole('button', {
        name: 'Cancel',
      });
      await userEvent.click(cancel);
      await waitFor(() => expect(heading).not.toBeVisible());
    });

    test('click delete', async () => {
      const heading = screen.queryByRole('heading', {
        name: 'Are you sure to delete multiple reports?',
      });
      expect(heading).toBeVisible();

      const submit = screen.getByRole('button', {
        name: 'Delete',
      });
      await userEvent.click(submit);
      await waitFor(() => expect(heading).not.toBeVisible());
      expect(onSuccess).toHaveBeenCalled();
    });

    test('click delete - server error', async () => {
      server.use(
        rest.post(
          'https://folio-testing-okapi.dev.folio.org/counter-reports/reports/delete',
          (req, res, ctx) => {
            return res(ctx.status(500));
          }
        )
      );
      const heading = screen.queryByRole('heading', {
        name: 'Are you sure to delete multiple reports?',
      });
      expect(heading).toBeVisible();

      const submit = screen.getByRole('button', {
        name: 'Delete',
      });
      await userEvent.click(submit);
      await waitFor(() => expect(onFail).toHaveBeenCalled());
    });
  });

  describe('check close dialog', () => {
    beforeEach(async () => {
      renderDeleteStatistics(stripes);
      const expandAllButton = screen.getByRole('button', {
        name: 'Expand all years',
      });
      await userEvent.click(expandAllButton);
      const idReport1 = counterReports[0].stats[0]['01'].id;
      const checkBoxRepOne = screen.getByTestId(`checkbox-${idReport1}`);
      await userEvent.click(checkBoxRepOne);
      const cancel = screen.getByRole('button', {
        name: 'Cancel',
      });
      await userEvent.click(cancel);
    });

    test('click keep editing', async () => {
      const heading = screen.queryByRole('heading', {
        name: 'Are you sure?',
      });
      expect(heading).toBeVisible();

      const keepEditing = screen.getByRole('button', {
        name: 'Keep editing',
      });
      await userEvent.click(keepEditing);
      await waitFor(() => expect(heading).not.toBeVisible());
      const deleteHeader = screen.getByRole('heading', {
        name: 'Delete multiple reports',
      });
      expect(deleteHeader).toBeInTheDocument();
    });
  });

  describe('check report info', () => {
    beforeEach(async () => {
      renderDeleteStatistics(stripes);
      const expandAllButton = screen.getByRole('button', {
        name: 'Expand all years',
      });
      await userEvent.click(expandAllButton);

      const reportJanButton = screen.getByTestId('clickable-download-stats-by-id-DR-2019-01');
      await userEvent.click(reportJanButton);
    });

    test('download report', async () => {
      const heading = screen.queryByRole('heading', {
        name: 'Report info',
      });
      expect(heading).toBeVisible();

      const download = screen.getByRole('button', {
        name: 'Icon Download report as JSON',
      });
      await userEvent.click(download);
      expect(onDownloadReportSingleMonthRaw).toHaveBeenCalled();
    });
  });
});
