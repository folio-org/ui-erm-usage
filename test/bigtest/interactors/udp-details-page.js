
import {
  attribute,
  clickable,
  fillable,
  interactor,
  isPresent,
  property,
  scoped,
  text,
  value
} from '@bigtest/interactor';


@interactor class InputFieldInteractor {
  clickInput = clickable();
  fillInput = fillable();

  fill(val) {
    return this
      .clickInput()
      .timeout(5000)
      .fillInput(val)
      .timeout(5000);
  }
}

@interactor class HarvestingAccordion {
  static defaultScope = '#harvestingAccordion';
}

@interactor class HarvestingAccordionButton {
  static defaultScope = '#accordion-toggle-button-harvestingAccordion';
  expanded = attribute('aria-expanded');
}

@interactor class NotesAccordionButton {
  static defaultScope = '#accordion-toggle-button-notesAccordion';
}

@interactor class StartHarvesterButton {
  isDisabled = property('button[id="start-harvester-button"]', 'disabled');
}

@interactor class SushiCredentialsAccordion {
  static defaultScope = '#sushiCredsAccordion';
}
@interactor class StatisticsAccordion {
  static defaultScope = '#statisticsAccordion';
}

@interactor class UploadAccordion {
  static defaultScope = '#uploadAccordion';
}

@interactor class ReportTypeDownloadSelect {
  static defaultScope = 'select[name="downloadMultiMonths.reportType"]';
  value = value();
}

@interactor class StartDateDownloadInput {
  static defaultScope = 'input[name="downloadMultiMonths.startDate"]';
  value = value();
}

@interactor class EndDateDownloadInput {
  static defaultScope = 'input[name="downloadMultiMonths.endDate"]';
  value = value();
}

@interactor class DateInputError {
  static defaultScope = '[class^="feedbackError---"]';
  feedbackError = text();
  exist = isPresent();
}

@interactor class ExpandAll {
  static defaultScope = '#clickable-expand-all-view';
}

@interactor class ReportInfoValid {
  static defaultScope = '[class="report-info-valid"]';
  downloadJsonXmlButton = scoped('button[id="download-json-xml-button"]');
  deleteButton = scoped('button[id="delete-report-button"]');
}

@interactor class ReportInfoFailed {
  static defaultScope = '[class="report-info-failed"]';
  downloadJsonXmlButton = scoped('button[id="download-json-xml-button"]');
  deleteButton = scoped('button[id="delete-report-button"]');
}

@interactor class TagsSelect {
  static defaulScope = ('#udps-paneset');
  clickable = clickable('#input-tag-input');
  tagSelection = scoped('#input-tag-input');
}

export default @interactor class UDPDetailsPage {
  static defaultScope = '#pane-udpdetails';
  title = text('[data-test-header-title]');
  clickEditUDP = clickable('#clickable-edit-udp');
  harvestingAccordion = new HarvestingAccordion();
  sushiCredentialsAccordion = new SushiCredentialsAccordion();
  statisticsAccordion = new StatisticsAccordion();
  uploadAccordion = new UploadAccordion();
  startDateDownloadInput = new InputFieldInteractor('[name="downloadMultiMonths.startDate"]');
  endDateDownloadInput = new InputFieldInteractor('[name="downloadMultiMonths.startDate"]');
  dateInputError = new DateInputError();
  reportTypeDownloadSelect = new ReportTypeDownloadSelect();
  expandAll = new ExpandAll();
  harvesterImpls = text('[data-test-service-type]');
  validReport = clickable('#clickable-download-stats-by-id-BR1-2018-01');
  failedReport = clickable('#clickable-download-stats-by-id-BR1-2018-02');
  reportInfoValid = new ReportInfoValid();
  reportInfoFailed = new ReportInfoFailed();
  harvestingAccordionButton = new HarvestingAccordionButton();
  notesAccordionButton = new NotesAccordionButton();
  startHarvesterButton = new StartHarvesterButton();

  clickShowTags = clickable('#clickable-show-tags');
  tagsSelect = new TagsSelect();
}
