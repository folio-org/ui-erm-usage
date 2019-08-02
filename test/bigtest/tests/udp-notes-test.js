import { beforeEach, describe, it } from '@bigtest/mocha';
import { faker } from '@bigtest/mirage';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import NotesAccordion from '../interactors/notes-accordion';
import NotesModal from '../interactors/notes-modal';
import NoteForm from '../interactors/note-form';
import NoteView from '../interactors/note-view';
import wait from '../helpers/wait';

const notesAccordion = new NotesAccordion();
const notesModal = new NotesModal();
const noteForm = new NoteForm();
const noteView = new NoteView();

/**
 * Thanks to https://github.com/folio-org/ui-eholdings/blob/master/test/bigtest/tests/resource-notes-flow-test.js for inspiration
*/
describe('UDP notes test', function () {
  setupApplication();

  let udp;
  let noteType;
  let udpNote;

  beforeEach(function () {
    udp = this.server.create('usage-data-provider', 'withUsageReports');

    noteType = this.server.create('note-type', {
      id: 'noteType1',
      name: 'Test note type',
    });

    udpNote = this.server.create('note', {
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
      this.visit(`/eusage/view/${udp.id}`);
    });

    it('should display notes accordion', () => {
      expect(notesAccordion.udpNotesAccordionIsDisplayed).to.be.true;
    });

    it('notes accordion should contain 2 notes', () => {
      expect(notesAccordion.notes().length).to.equal(2);
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

    describe('and new button was clicked', () => {
      beforeEach(async () => {
        await notesAccordion.newButton.click();
      });

      it('should open create note page', function () {
        expect(this.location.pathname).to.equal('/eusage/notes/create');
      });

      it('displays assignment accordion as closed', () => {
        expect(noteForm.assignmentAccordion.isOpen).to.equal(false);
      });

      it('should disable save button', () => {
        expect(noteForm.saveButton.isDisabled).to.be.true;
      });

      describe('and close button was clicked', () => {
        beforeEach(async () => {
          await noteForm.closeButton.click();
        });

        it('should redirect to previous location', function () {
          expect(this.location.pathname + this.location.search).to.have.string(`/eusage/view/${udp.id}`);
        });
      });


      describe('and correct note data was entered', () => {
        beforeEach(async () => {
          await noteForm.enterNoteData(noteType.name, 'some note title');
        });

        it('should enable save button', () => {
          expect(noteForm.saveButton.isDisabled).to.be.false;
        });

        describe('and close button was clicked', () => {
          beforeEach(async () => {
            await noteForm.closeButton.click();
          });

          it('should display navigation modal', function () {
            expect(noteForm.navigationModalIsOpened).to.be.true;
          });

          describe('and cancel navigation button was clicked', () => {
            beforeEach(async () => {
              await noteForm.clickCancelNavigationButton();
            });

            it('should close navigation modal', () => {
              expect(noteForm.navigationModalIsOpened).to.be.false;
            });

            it('should keep the user on the same page', function () {
              expect(this.location.pathname + this.location.search).to.equal('/eusage/notes/create');
            });
          });

          describe('and continue navigation button was clicked', () => {
            beforeEach(async () => {
              await noteForm.clickContinueNavigationButton();
            });

            it('should close navigation modal', () => {
              expect(noteForm.navigationModalIsOpened).to.be.false;
            });

            it('should redirect to previous page', function () {
              expect(this.location.pathname + this.location.search).to.have.string(`/eusage/view/${udp.id}`);
            });
          });
        });

        describe('and save button was clicked', () => {
          beforeEach(async () => {
            await noteForm.saveButton.click();
          });

          it('should redirect to previous page', function () {
            expect(this.location.pathname + this.location.search).to.have.string(`/eusage/view/${udp.id}`);
          });

          it('notes accordion should contain 2 notes', () => {
            expect(notesAccordion.notes().length).to.equal(2);
          });
        });
      });
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
            expect(notesModal.notes(1).checkboxIsSelected).to.be.false;
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

              it('notes accordion should contain 2 notes', () => {
                expect(notesAccordion.notes().length).to.equal(2);
              });
            });
          });
        });
      });

      describe('and a note in the notes list was clicked', () => {
        beforeEach(async () => {
          await notesAccordion.notes(0).click();
        });

        it('should redirect to note view page', function () {
          expect(this.location.pathname + this.location.search).to.equal(`/eusage/notes/${udpNote.id}`);
        });

        it('should display general information accordion', () => {
          expect(noteView.generalInfoAccordionIsDisplayed).to.be.true;
        });

        it('should display correct note type', () => {
          expect(noteView.noteType).to.equal(udpNote.type);
        });

        it('should display correct note title', () => {
          expect(noteView.noteTitle).to.equal(udpNote.title);
        });

        it('should display correct note details', () => {
          expect(noteView.noteDetails).to.equal(udpNote.content);
        });

        it('should display assignments information accordion', () => {
          expect(noteView.assignmentInformationAccordionIsDisplayed).to.be.true;
        });

        it('displays assignment accordion as closed', () => {
          expect(noteView.assignmentAccordion.isOpen).to.equal(false);
        });

        it('should display correct referred entity type', () => {
          expect(noteView.referredEntityType.toLowerCase()).to.equal('usage data provider');
        });

        it('should display correct referred entity label', () => {
          expect(noteView.referredEntityName).to.equal(udp.label);
        });

        describe('and close button is clicked', () => {
          beforeEach(async () => {
            await noteView.clickCancelButton();
          });

          it('should redirect to previous location', function () {
            expect(this.location.pathname + this.location.search).to.have.string(`/eusage/view/${udp.id}`);
          });
        });

        describe('and delete button was clicked', async () => {
          beforeEach(async () => {
            await noteView.performDeleteNoteAction();
          });

          it('should open confirmation modal', () => {
            expect(noteView.deleteConfirmationModalIsDisplayed).to.be.true;
          });

          describe('and cancel button was clicked', () => {
            beforeEach(async () => {
              await noteView.deleteConfirmationModal.clickCancelButton();
            });

            it('should close confirmation modal', () => {
              expect(noteView.deleteConfirmationModalIsDisplayed).to.be.false;
            });
          });

          describe('and confirm button was clicked', () => {
            beforeEach(async () => {
              await noteView.deleteConfirmationModal.clickConfirmButton();
            });

            it('should redirect to eusage view page', function () {
              expect(this.location.pathname + this.location.search).to.have.string(`/eusage/view/${udp.id}`);
            });
          });
        });

        describe('and edit button is clicked', () => {
          beforeEach(async () => {
            await noteView.clickEditButton();
          });

          it('should redirect to note edit page', function () {
            expect(this.location.pathname + this.location.search).to.equal(`/eusage/notes/${udpNote.id}/edit`);
          });

          it('should display general information accordion', () => {
            expect(noteForm.formFieldsAccordionIsDisplayed).to.be.true;
          });

          it('should display correct note title', () => {
            expect(noteForm.noteTitleField.value).to.equal(udpNote.title);
          });

          it('should display correct note type', () => {
            expect(noteForm.noteTypesSelect.value).to.equal(noteType.id);
          });

          it('should display correct note details', () => {
            expect(noteForm.noteDetailsField.value).to.equal(udpNote.content);
          });

          it('should display assignments information accordion', () => {
            expect(noteForm.assignmentInformationAccordionIsDisplayed).to.be.true;
          });

          it('should display correct referred entity type', () => {
            expect(noteForm.referredEntityType.toLowerCase()).to.equal('usage data provider');
          });

          it('should display correct referred entity label', () => {
            expect(noteForm.referredEntityName).to.equal(udp.label);
          });

          it('should disable save button', () => {
            expect(noteForm.saveButton.isDisabled).to.be.true;
          });

          describe('and dropdown close button is clicked', () => {
            beforeEach(async () => {
              await noteForm.openDropdownAndClickCloseButton();
            });

            it('should redirect to previous page', function () {
              expect(this.location.pathname + this.location.search).to.equal(`/eusage/notes/${udpNote.id}`);
            });
          });

          describe('and the form is touched', () => {
            describe('and note data was entered', () => {
              beforeEach(async () => {
                await noteForm.enterNoteData(noteType.name, 'some note title');
              });

              it('should enable save button', () => {
                expect(noteForm.saveButton.isDisabled).to.be.false;
              });

              describe('and close button was clicked', () => {
                beforeEach(async () => {
                  await noteForm.closeButton.click();
                });

                it('should display navigation modal', function () {
                  expect(noteForm.navigationModalIsOpened).to.be.true;
                });

                describe('and cancel navigation button was clicked', () => {
                  beforeEach(async () => {
                    await noteForm.clickCancelNavigationButton();
                  });

                  it('should close navigation modal', () => {
                    expect(noteForm.navigationModalIsOpened).to.be.false;
                  });

                  it('should keep the user on the same page', function () {
                    expect(this.location.pathname + this.location.search).to.equal(`/eusage/notes/${udpNote.id}/edit`);
                  });
                });

                describe('and continue navigation button was clicked', () => {
                  beforeEach(async () => {
                    await noteForm.clickContinueNavigationButton();
                  });

                  it('should close navigation modal', () => {
                    expect(noteForm.navigationModalIsOpened).to.be.false;
                  });

                  it('should redirect to previous page', function () {
                    expect(this.location.pathname + this.location.search).to.have.string(`/eusage/notes/${udpNote.id}`);
                  });
                });
              });

              describe('and dropdown close button was clicked', () => {
                beforeEach(async () => {
                  await noteForm.openDropdownAndClickCloseButton();
                });

                it('should display navigation modal', function () {
                  expect(noteForm.navigationModalIsOpened).to.be.true;
                });

                describe('and cancel navigation button was clicked', () => {
                  beforeEach(async () => {
                    await noteForm.clickCancelNavigationButton();
                  });

                  it('should close navigation modal', () => {
                    expect(noteForm.navigationModalIsOpened).to.be.false;
                  });

                  it('should keep the user on the same page', function () {
                    expect(this.location.pathname + this.location.search).to.equal(`/eusage/notes/${udpNote.id}/edit`);
                  });
                });

                describe('and continue navigation button was clicked', () => {
                  beforeEach(async () => {
                    await noteForm.clickContinueNavigationButton();
                  });

                  it('should close navigation modal', () => {
                    expect(noteForm.navigationModalIsOpened).to.be.false;
                  });

                  it('should redirect to previous page', function () {
                    expect(this.location.pathname + this.location.search).to.equal(`/eusage/notes/${udpNote.id}`);
                  });
                });
              });

              describe('and save button was clicked', () => {
                beforeEach(async () => {
                  await noteForm.saveButton.click();
                });

                it('should redirect to previous page', function () {
                  expect(this.location.pathname + this.location.search).to.equal(`/eusage/notes/${udpNote.id}/edit`);
                });
              });
            });
          });
        });
      });
    });
  });
});
