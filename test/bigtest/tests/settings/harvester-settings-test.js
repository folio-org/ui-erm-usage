import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import HarvesterSettingsInteractor from '../../interactors/settings/harvester';

describe('Harvester settings', () => {
  setupApplication();
  const harvesterSettingsInteractor = new HarvesterSettingsInteractor();

  beforeEach(async function () {
    this.visit('/settings/eusage/harvester');

    await harvesterSettingsInteractor.clickSaveConfig();
  });

  describe('change max failed attempts', () => {
    beforeEach(async function () {
      await harvesterSettingsInteractor.maxFailedAttempts.fill(5);
    });

    it('update button is enabled', () => {
      expect(harvesterSettingsInteractor.isDisabledClickAndSave).to.be.false;
    });
  });
});
