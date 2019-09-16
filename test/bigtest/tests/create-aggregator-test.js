import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import AggregatorInteractor from '../interactors/aggregator';
import AggregatorEditPage from '../interactors/aggregator-edit-page';

import setupApplication from '../helpers/setup-application';

describe('Create Aggregator', () => {
  setupApplication();
  const aggregatorInteractor = new AggregatorInteractor();
  const aggregatorEditPage = new AggregatorEditPage();

  beforeEach(function () {
    return this.visit('/settings/eusage/aggregators?layer=add', () => {
      expect(aggregatorInteractor.$root).to.exist;
    });
  });

  it('serviceType select is available', () => {
    expect(aggregatorEditPage.serviceTypeSelect.value).to.be.equal('');
  });

  describe('serviceType can be selected', () => {
    beforeEach(async () => {
      await aggregatorEditPage.serviceTypeSelect.select('Nationaler Statistikserver');
    });

    it('serviceType is changed to "NSS"', () => {
      expect(aggregatorEditPage.serviceTypeSelect.value).to.be.equal('NSS');
    });
  });

  describe('accountConfigType can be selected', () => {
    beforeEach(async () => {
      await aggregatorEditPage.accountConfigTypeSelect.select('API');
    });

    it('accountConfigType is changed to "API"', () => {
      expect(aggregatorEditPage.accountConfigTypeSelect.value).to.be.equal('API');
    });
  });

  describe('add aggregator config', () => {
    beforeEach(async () => {
      await aggregatorEditPage.clickAddConfigParam();
    });

    it('should add config param', () => {
      expect(aggregatorEditPage.configParams().length).to.be.equal(1);
    });

    describe('fill key and value', () => {
      beforeEach(async () => {
        await aggregatorEditPage.aggConfigFirstKey.fill('key1');
        await aggregatorEditPage.aggConfigFirstVal.fill('val1');
      });
      it('key1 is changed to "key1"', () => {
        expect(aggregatorEditPage.aggConfigFirstKey.value).to.be.equal('key1');
      });


      describe('remove aggregator config', () => {
        beforeEach(async () => {
          await aggregatorEditPage.clickAddConfigParam();
        });
        describe('delete second config param', () => {
          beforeEach(async () => {
            await await aggregatorEditPage.clickRemoveConfigParam();
          });
          it('should deleted second config param', () => {
            expect(aggregatorEditPage.configParams().length).to.be.equal(1);
          });
        });
      });

    });
  });
});
