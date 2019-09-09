import { beforeEach, describe, it } from '@bigtest/mocha';

import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import StartHarvester from '../interactors/start-harvester';

describe('Usage Data Provider', () => {
  setupApplication();

  const startHarvester = new StartHarvester();

  beforeEach(async function () {
    this.visit('/settings/eusage/start-harvester');
  });

  it('shows the start harvester button', () => {
    expect(startHarvester.startButton).to.equal(true);
  });
});
