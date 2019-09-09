import { beforeEach, describe, it } from '@bigtest/mocha';

import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import PeriodicHarvestingConfig from '../interactors/periodic-harvesting-config';

describe('Periodic harvesting config', () => {
  setupApplication();

  const periodicHarvestingConfig = new PeriodicHarvestingConfig();

  beforeEach(function () {
    this.visit('/settings/eusage/periodic-harvesting');
  });

  it('shows the not defined info', () => {
    expect(periodicHarvestingConfig.notDefined.isVisible).to.equal(true);
  });

  describe('and the edit config button was clicked', () => {
    beforeEach(async () => {
      await periodicHarvestingConfig.clickOpenEdit();
    });

    it('should show edit form', () => {
      expect(periodicHarvestingConfig.editForm).to.be.true;
    });

    describe('harvesting interval can be selected', () => {
      beforeEach(async () => {
        await periodicHarvestingConfig.periodicIntervalSelect.select('Weekly');
      });

      it('harvesting interval is changed to "weekly"', () => {
        expect(periodicHarvestingConfig.periodicIntervalSelect.value).to.be.equal('weekly');
      });

      describe('and save button was clicked', () => {
        beforeEach(async () => {
          await periodicHarvestingConfig.clickSaveConfig();
        });

        it('should close notes modal', () => {
          expect(periodicHarvestingConfig.editForm).to.be.false;
        });

        describe('click open edit', () => {
          beforeEach(async () => {
            await periodicHarvestingConfig.clickOpenEdit();
          });

          it('should show edit form', () => {
            expect(periodicHarvestingConfig.editForm).to.be.true;
          });

          it('delete button is visible', () => {
            expect(periodicHarvestingConfig.clickDeleteConfig).to.be.true;
          });
        });
      });
    });
  });
});
