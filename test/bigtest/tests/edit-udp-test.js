import {
  beforeEach,
  describe,
  it
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import UDPEditPage from '../interactors/udp-edit-page';
import UDPInteractor from '../interactors/udp';

describe('Edit UDP', () => {
  setupApplication();
  const udpInteractor = new UDPInteractor();
  const udpEditPage = new UDPEditPage();

  let udp = null;

  beforeEach(async function () {
    udp = this.server.create('usage-data-provider');
    return this.visit('/eusage?filters=harvestingStatus.active', () => {
      expect(udpInteractor.$root).to.exist;
    });
  });

  describe('UDP edit form is displayed', () => {
    beforeEach(async function () {
      return this.visit(`/eusage/${udp.id}/edit?filters=harvestingStatus.Inactive,harvestingStatus.active`);
    });

    it('displays Edit UDP form', () => {
      expect(udpEditPage.$root).to.exist;
    });

    describe('Confirm delete udp is displayed', () => {
      beforeEach(async function () {
        await udpEditPage.clickDeleteUDP();
      });
      it('displays confirm delete udp', () => {
        expect(udpEditPage.deleteUDPConfirmation).to.exist;
      });

      describe('and cancel was clicked', () => {
        beforeEach(async function () {
          await udpEditPage.deleteUDPConfirmation.clickCancelDeleteUDP();
        });
        it('displays Edit UDP form after click on cancel', () => {
          expect(udpEditPage.$root).to.exist;
        });
      });
    });
  });
});
