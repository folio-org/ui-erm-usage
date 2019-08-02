import {
  interactor,
  isPresent,
  fillable,
  clickable,
  value,
  is,
  blurrable,
  selectable,
  text,
} from '@bigtest/interactor';

import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';

@interactor class Select {
  selectOption = selectable();
  blur = blurrable();
  value = value();

  selectAndBlur(val) {
    return this
      .selectOption(val)
      .blur();
  }
}

@interactor class Button {
  isDisabled = is('[disabled]');
  click = clickable();
}

@interactor class FormField {
  enterText(string) {
    return this
      .fill(string)
      .blur();
  }

  blur = blurrable();
  fill = fillable();
  value = value();
}

@interactor class NoteDetailsField {
  value = text();
}

@interactor class NoteForm {
  closeButton = new Button('[data-test-leave-note-form]');
  saveButton = new Button('[data-test-save-note]');
  formFieldsAccordionIsDisplayed = isPresent('#noteForm');
  assignmentInformationAccordionIsDisplayed = isPresent('#assigned');
  noteTypesSelect = new Select('[data-test-note-types-field]');
  noteTitleField = new FormField('[data-test-note-title-field]');
  noteDetailsField = new NoteDetailsField('.ql-editor');
  navigationModalIsOpened = isPresent('#navigation-modal');
  clickCancelNavigationButton = clickable('[data-test-navigation-modal-dismiss]');
  clickContinueNavigationButton = clickable('[data-test-navigation-modal-continue]');
  referredEntityType = text('[data-test-referred-entity-type]');
  referredEntityName = text('[data-test-referred-entity-name]');
  clickPaneHeaderButton = clickable('[class^="paneHeaderCenterButton"]');
  clickDropdownCancelButton = clickable('[data-test-leave-note-form]');
  assignmentAccordion = new AccordionInteractor('#assigned');

  enterNoteData(noteType, noteTitle) {
    return this.noteTypesSelect.selectAndBlur(noteType)
      .noteTitleField.enterText(noteTitle);
  }

  openDropdownAndClickCloseButton() {
    return this.clickPaneHeaderButton()
      .clickDropdownCancelButton();
  }
}

export default NoteForm;
