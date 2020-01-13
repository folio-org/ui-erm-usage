import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import UDPInteractor from '../../interactors/udp';

describe('UDPs error codes filter', () => {
  setupApplication({ scenarios: ['error-codes-filters'] });

  const udps = new UDPInteractor();

  beforeEach(function () {
    this.visit('/eusage');
  });

  describe('open error codes filter', () => {
    beforeEach(async () => {
      await udps.errorCodesFilter.open();
    });

    it('displays error codes multi select', () => {
      expect(udps.errorCodesFilter.multiSelect.isPresent).to.equal(true);
    });
  });
});
