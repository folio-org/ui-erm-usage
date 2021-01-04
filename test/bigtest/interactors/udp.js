import {
  interactor,
  scoped,
  collection,
  clickable
} from '@bigtest/interactor';

import MultiSelectFilterInteractor from './filters';

@interactor class ReportTypesAccordion {
  static defaultScope = '#accordion-toggle-button-clickable-report-types-filter';
}

@interactor class ReportTypesFilter {
  static defaultScope = '#multiselect-input-report-types-filter';
}

@interactor class ReportTypesFilterOptionList {
  static defaultScope = '#multiselect-option-list-report-types-filter';
  instances = collection('[role=option]');
}

@interactor class SelectedReportTypes {
  static defaultScope = '[class^=multiSelectValueList---]';
  instances = collection('[class^=valueChipRoot---]');
  clickSelectedReportType = clickable('[class^=iconButtonInner---]');
}

export default @interactor class UDPInteractor {
  static defaultScope = '[data-test-udp-instances]';

  instances = collection('[role=row]');
  clickFirstRow = clickable('a[aria-rowindex="2"]');

  instance = scoped('#pane-udpdetails');
  errorCodesFilter = scoped('#clickable-error-codes-filter', MultiSelectFilterInteractor);

  reportTypesAccordion = new ReportTypesAccordion();
  reportTypesFilter = new ReportTypesFilter();
  reportTypesFilterOptionList = new ReportTypesFilterOptionList();
  selectedReportTypes = new SelectedReportTypes();
}
