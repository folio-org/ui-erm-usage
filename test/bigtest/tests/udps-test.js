import { beforeEach, describe, it } from '@bigtest/mocha';

import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import UDPInteractor from '../interactors/udp';

describe('Usage Data Provider', () => {
  setupApplication();

  const udp = new UDPInteractor();

  beforeEach(async function () {
    this.server.createList('usage-data-provider', 25);
    await this.visit('/eusage?filters=harvestingStatus.active');
  });

  it('shows the list of udp items - udps', () => {
    expect(udp.isVisible).to.equal(true);
  });

  it('renders each instance', () => {
    expect(udp.instances().length).to.be.gte(5);
  });

  describe('clicking on the first item', function () {
    beforeEach(async function () {
      await udp.clickFirstRow();
    });

    it('loads the instance details', function () {
      expect(udp.instance.isVisible).to.equal(true);
    });
  });

  describe('can expand report types filter accordion', () => {
    beforeEach(async function () {
      await udp.reportTypesAccordion.click();
    });

    it('report types filter is visible', () => {
      expect(udp.reportTypesFilter.isPresent).to.equal(true);
    });

    describe('expand report types filter and select first filter', () => {
      beforeEach(async function () {
        await udp.reportTypesFilter.click();
        await udp.reportTypesFilterOptionList.instances(0).click();
      });

      it('selected a report type', () => {
        expect(udp.selectedReportTypes.instances().length).to.equal(1);
      });

      describe('and remove selected report type', () => {
        beforeEach(async function () {
          await udp.selectedReportTypes.clickSelectedReportType();
        });
        it('selected no report type', () => {
          expect(udp.selectedReportTypes.isPresent).to.equal(false);
        });
      });
    });
  });
});
