
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
    await this.visit('/eusage/?filters=harvestingStatus.active');
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
      expect(udpDetailsPage.statisticsAccordion.isPresent).to.equal(true);
      expect(udpDetailsPage.uploadAccordion.isPresent).to.equal(true);
    });

    describe('all accordions can be expanded', function () {
      beforeEach(async function () {
        await udpDetailsPage.expandAll.click();
      });

      it('harvesting configuration is expanded and harvesting status is displayed', () => {
        expect(udpDetailsPage.harvestingAccordionButton.expanded).to.be.equal('true');
      });

      describe('all accordions can be collapsed', function () {
        beforeEach(async function () {
          await udpDetailsPage.expandAll.click();
        });

        it('harvesting configuration is collapsed and harvesting status is not displayed', () => {
          expect(udpDetailsPage.harvestingAccordionButton.expanded).to.be.equal('false');
        });
      });
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
        expect(udpDetailsPage.reportTypeDownloadSelect.value).to.be.equal('BR1');
      });

      describe('JR1 can be selected', () => {
        beforeEach(async () => {
          await udpDetailsPage.reportTypeDownloadSelect.select('JR1');
        });
        it('reportType is changed to "JR1"', () => {
          expect(udpDetailsPage.reportTypeDownloadSelect.value).to.be.equal('JR1');
        });
      });
    });

    describe('can open report info menu', () => {
      beforeEach(async function () {
        await udpDetailsPage.statisticsAccordion.click();
      });

      describe('valid report has correct buttons', () => {
        beforeEach(async function () {
          await udpDetailsPage.validReport();
        });

        it('valid report has download json xml and delete button', () => {
          expect(udpDetailsPage.reportInfoValid.downloadJsonXmlButton.isPresent).to.equal(true);
          expect(udpDetailsPage.reportInfoValid.deleteButton.isPresent).to.equal(true);
        });
      });

      describe('failed report has correct buttons', () => {
        beforeEach(async function () {
          await udpDetailsPage.failedReport();
        });

        it('failed report has delete button but not download json xml button', () => {
          expect(udpDetailsPage.reportInfoFailed.downloadJsonXmlButton.isPresent).to.equal(false);
          expect(udpDetailsPage.reportInfoFailed.deleteButton.isPresent).to.equal(true);
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

describe('Inactive UDP disabled start harvester', () => {
  setupApplication();
  const udpDetailsPage = new UDPDetailsPage();

  let udp = null;
  beforeEach(async function () {
    udp = this.server.create('usage-data-provider', 'withSetInactive');
    this.visit(`/eusage/view/${udp.id}`);
  });

  it('harvesting config accordion is present', function () {
    expect(udpDetailsPage.harvestingAccordion.isPresent).to.equal(true);
  });

  describe('open harvesting accordion and check if start harvesting button is disabled', function () {
    beforeEach(async function () {
      await udpDetailsPage.harvestingAccordionButton.click();
    });

    it('start harvesting button is present and disabled', () => {
      expect(udpDetailsPage.startHarvesterButton.isPresent).to.equal(true);
      expect(udpDetailsPage.startHarvesterButton.isDisabled).to.equal(true);
    });
  });
});

describe('Active UDP enabled start harvester', () => {
  setupApplication();
  const udpDetailsPage = new UDPDetailsPage();

  let udp = null;
  beforeEach(async function () {
    udp = this.server.create('usage-data-provider');
    this.visit(`/eusage/view/${udp.id}`);
  });

  it('harvesting config accordion is present', function () {
    expect(udpDetailsPage.harvestingAccordion.isPresent).to.equal(true);
  });

  describe('open harvesting accordion and check if start harvesting button is enabled', function () {
    beforeEach(async function () {
      await udpDetailsPage.harvestingAccordionButton.click();
    });

    it('start harvesting button is present and enabled', () => {
      expect(udpDetailsPage.startHarvesterButton.isPresent).to.equal(true);
      expect(udpDetailsPage.startHarvesterButton.isDisabled).to.equal(false);
    });
  });
});
