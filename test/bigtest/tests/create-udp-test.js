import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import UDPInteractor from '../interactors/udp';
import UDPEditPage from '../interactors/udp-edit-page';

import setupApplication from '../helpers/setup-application';

describe('Create UDP', () => {
  setupApplication();
  const udpInteractor = new UDPInteractor();
  const udpEditPage = new UDPEditPage();

  beforeEach(function () {
    return this.visit('/eusage?filters=harvestingStatus.Active&layer=create', () => {
      expect(udpInteractor.$root).to.exist;
    });
  });

  it('harvestingStatus select is available', () => {
    expect(udpEditPage.harvestingStatusSelect.value).to.be.equal('');
  });

  describe('harvestingStatus can be selected', () => {
    beforeEach(async () => {
      await udpEditPage.harvestingStatusSelect.select('Active');
    });

    it('harvestingStatus is changed to "active"', () => {
      expect(udpEditPage.harvestingStatusSelect.value).to.be.equal('active');
    });
  });

  describe('harvestingStatus can be changed to inactive', () => {
    beforeEach(async () => {
      await udpEditPage.harvestingStatusSelect.select('Active');
      await udpEditPage.harvestingStatusSelect.select('Inactive');
    });

    it('harvestingStatus is changed back to blank', () => {
      expect(udpEditPage.harvestingStatusSelect.value).to.be.equal('inactive');
    });
  });
});
