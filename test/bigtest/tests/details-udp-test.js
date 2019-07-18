
import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';
import setupApplication from '../helpers/setup-application';
import UDPDetailsPage from '../interactors/udp-details-page';
import UDPInteractor from '../interactors/udp';

describe('UDPDetailsPage', () => {
  setupApplication();
  const udpDetailsPage = new UDPDetailsPage();
  const udpInteractor = new UDPInteractor();

  let udp = null;
  beforeEach(async function () {
    udp = this.server.create('usage-data-provider', 'withUsageReports');
    this.visit('/eusage?filters=harvestingStatus.Active');

    await udpInteractor.clickActiveUDPsCheckbox();
  });

  it('shows the list of udp items', () => {
    expect(udpInteractor.isVisible).to.equal(true);
  });

  it('renders each instance', () => {
    expect(udpInteractor.instances().length).to.be.gte(1);
  });

  describe('clicking on the first item', function () {
    beforeEach(async function () {
      await udpInteractor.instances(0).click();
    });

    it('displays udp label in the pane header', function () {
      expect(udpDetailsPage.title).to.include(udp.label);
    });

    it('all accordions are present', function () {
      expect(udpDetailsPage.harvestingAccordion.isPresent).to.equal(true);
      expect(udpDetailsPage.sushiCredentialsAccordion.isPresent).to.equal(true);
      expect(udpDetailsPage.notesAccordion.isPresent).to.equal(true);
      expect(udpDetailsPage.statisticsAccordion.isPresent).to.equal(true);
      expect(udpDetailsPage.uploadAccordion.isPresent).to.equal(true);
    });

    describe('service type is set correctly', function () {
      beforeEach(async function () {
        await udpDetailsPage.harvestingAccordion.click();
      });

      it('service type is set', () => {
        expect(udpDetailsPage.harvesterImpls).to.be.equal('Counter-Sushi 4.1');
      });
    });

    describe('can select report type for download multi months', function () {
      beforeEach(async function () {
        await udpDetailsPage.statisticsAccordion.click();
      });

      it('report type select is available', () => {
        expect(udpDetailsPage.reportTypeDownloadSelect.value).to.be.equal('JR1');
      });

      describe('BR1 can be selected', () => {
        beforeEach(async () => {
          await udpDetailsPage.reportTypeDownloadSelect.select('BR1');
        });
        it('reportType is changed to "BR1"', () => {
          expect(udpDetailsPage.reportTypeDownloadSelect.value).to.be.equal('BR1');
        });
      });
    });

    describe('can open report action menu', () => {
      beforeEach(async function () {
        await udpDetailsPage.statisticsAccordion.click();
      });

      describe('valid report has correct buttons', () => {
        beforeEach(async function () {
          await udpDetailsPage.validReport();
        });

        it('valid report has download json xml and delete button', () => {
          expect(udpDetailsPage.reportActionMenuValid.downloadJsonXmlButton.isPresent).to.equal(true);
          expect(udpDetailsPage.reportActionMenuValid.deleteButton.isPresent).to.equal(true);
        });
      });

      describe('failed report has correct buttons', () => {
        beforeEach(async function () {
          await udpDetailsPage.failedReport();
        });

        it('failed report has delete button but not download json xml button', () => {
          expect(udpDetailsPage.reportActionMenuFailed.downloadJsonXmlButton.isPresent).to.equal(false);
          expect(udpDetailsPage.reportActionMenuFailed.deleteButton.isPresent).to.equal(true);
        });
      });
    });
  });
});

describe('UDPDetailsPage by ID', () => {
  setupApplication();
  const udpDetailsPage = new UDPDetailsPage();

  let udp = null;
  beforeEach(async function () {
    udp = this.server.create('usage-data-provider', 'withUsageReports');
    this.visit(`/eusage/view/${udp.id}`);
  });

  it('displays udp label in the pane header', function () {
    expect(udpDetailsPage.title).to.include(udp.label);
  });
});
