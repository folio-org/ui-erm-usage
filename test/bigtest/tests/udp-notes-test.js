import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import NotesAccordion from '../interactors/notes-accordion';
import NotesModal from '../interactors/notes-modal';
import UDPDetailsPage from '../interactors/udp-details-page';
import wait from '../helpers/wait';

const notesAccordion = new NotesAccordion();
const notesModal = new NotesModal();
const udpDetailsPage = new UDPDetailsPage();

/**
 * Thanks to https://github.com/folio-org/ui-eholdings/blob/master/test/bigtest/tests/resource-notes-flow-test.js for inspiration
*/
describe('UDP notes test', function () {
  setupApplication();

  let udp;
  let noteType;

  beforeEach(function () {
    udp = this.server.create('usage-data-provider', 'withUsageReports');

    noteType = this.server.create('note-type', {
      id: 'noteType1',
      name: 'Test note type',
    });

    this.server.create('note', {
      type: noteType.name,
      typeId: noteType.id,
      links: [{ type: 'erm-usage-data-provider', id: udp.id }],
    });

    this.server.create('note', {
      type: noteType.name,
      typeId: noteType.id,
      links: [{ type: 'erm-usage-data-provider', id: udp.id }],
    });

    this.server.create('note', {
      type: noteType.name,
      typeId: noteType.id,
    });
  });

  describe('when the udp details page is visited', () => {
    beforeEach(async function () {
      await this.visit(`/eusage/${udp.id}`);
      await udpDetailsPage.notesAccordionButton.click();
    });

    it('should display notes accordion', () => {
      expect(notesAccordion.udpNotesAccordionIsDisplayed).to.be.true;
    });

    it('should display create note button', () => {
      expect(notesAccordion.newButtonDisplayed).to.be.true;
    });

    it('should display assign button', () => {
      expect(notesAccordion.assignButtonDisplayed).to.be.true;
    });

    it('should display notes list', () => {
      expect(notesAccordion.notesListIsDisplayed).to.be.true;
    });

    describe('and assign button was clicked', () => {
      beforeEach(async () => {
        await notesAccordion.assignButton.click();
      });

      it('should open notes modal', function () {
        expect(notesModal.isDisplayed).to.be.true;
      });

      it('should disable search button', () => {
        expect(notesModal.searchButtonIsDisabled).to.be.true;
      });

      it('should display empty message', () => {
        expect(notesModal.emptyMessageIsDisplayed).to.be.true;
      });

      describe('and search query was entered', () => {
        beforeEach(async () => {
          await notesModal.enterSearchQuery('some note');
          await wait(300);
        });

        it('should enable search button', () => {
          expect(notesModal.searchButtonIsDisabled).to.be.false;
        });

        describe('and the search button was clicked', () => {
          beforeEach(async () => {
            await notesModal.clickSearchButton();
          });

          it('should display notes list', () => {
            expect(notesModal.notesListIsDisplayed).to.be.true;
          });
        });

        describe('and unassigned filter was selected', () => {
          beforeEach(async () => {
            await notesModal.selectUnassignedFilter();
          });

          it('notes list should contain 1 note', () => {
            expect(notesModal.notes().length).to.equal(1);
          });

          it('notes list should display only unselected notes', () => {
            expect(notesModal.notes(0).checkboxIsSelected).to.be.false;
          });

          describe('and the first note in the list was checked', () => {
            beforeEach(async () => {
              await notesModal.notes(0).clickCheckbox();
            });

            describe('and save button was clicked', () => {
              beforeEach(async () => {
                await notesModal.clickSaveButton();
              });

              it('should close notes modal', () => {
                expect(notesModal.isDisplayed).to.be.false;
              });
            });
          });
        });
      });
    });
  });
});
