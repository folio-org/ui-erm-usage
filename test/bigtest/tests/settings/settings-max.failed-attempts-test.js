import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import HarvesterSettingsInteractor from '../../interactors/settings/max-failed-attempts';

describe('Harvester max failed attempts settings', () => {
  setupApplication();
  const harvesterSettingsInteractor = new HarvesterSettingsInteractor();

  beforeEach(async function () {
    this.visit('/settings/eusage/failed-attempts');

    await harvesterSettingsInteractor.clickSaveConfig();
  });

  describe('maxFailedAttempts default is set', () => {
    it('default is set', () => {
      expect(harvesterSettingsInteractor.maxFailedAttempts.value).to.be.equal('5');
    });
  });

  describe('change max failed attempts', () => {
    beforeEach(async function () {
      await harvesterSettingsInteractor.maxFailedAttempts.fill(4);
    });

    it('update button is enabled', () => {
      expect(harvesterSettingsInteractor.isDisabledClickAndSave).to.be.false;
    });
  });
});
