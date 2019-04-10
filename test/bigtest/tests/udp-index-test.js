import { beforeEach, describe, it } from '@bigtest/mocha';

import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import UDPInteractor from '../interactors/udp';

describe('Usage Data Provider', () => {
  setupApplication();

  const udp = new UDPInteractor();

  beforeEach(async function () {
    this.server.createList('usage-data-provider', 25);
    this.visit('/eusage?filters=harvestingStatus.Active');

    await udp.clickActiveUDPsCheckbox();
  });

  it('shows the list of udp items', () => {
    expect(udp.isVisible).to.equal(true);
  });

  it('renders each instance', () => {
    expect(udp.instances().length).to.be.gte(5);
  });

  describe('clicking on the first item', function () {
    beforeEach(async function () {
      await udp.instances(0).click();
    });

    it('loads the instance details', function () {
      expect(udp.instance.isVisible).to.equal(true);
    });
  });
});
