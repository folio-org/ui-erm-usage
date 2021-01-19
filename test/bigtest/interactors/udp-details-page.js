import {
  attribute,
  clickable,
  collection,
  fillable,
  interactor,
  is,
  isPresent,
  property,
  scoped,
  text,
  triggerable,
  value
} from '@bigtest/interactor';

const file = new File([], 'Test File', { type: 'text/plain' });
const event = { dataTransfer: { files: [file], types: ['Files'] } };

@interactor class FileUploaderInteractor {
  static defaultScope = 'input[type="file"]';
  drop = triggerable('drop', event);
}

@interactor class DownloadFileButton {
  static defaulScope = 'button[data-test-doc-file]';
}

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

@interactor class DataTypeDownloadSelect {
  static defaultScope = 'select[name="downloadMultiMonths.formats"]';
  value = value();
}

@interactor class StartDateDownloadInput {
  static defaultScope = 'input[name="downloadMultiMonths.startDate"]';
  clickInput = clickable();
  fillInput = fillable();

  fill(val) {
    return this
      .clickInput()
      .timeout(5000)
      .fillInput(val)
      .timeout(5000);
  }

  value = value();
}

@interactor class EndDateDownloadInput {
  static defaultScope = 'input[name="downloadMultiMonths.endDate"]';

  clickInput = clickable();
  fillInput = fillable();

  fill(val) {
    return this
      .clickInput()
      .timeout(5000)
      .fillInput(val)
      .timeout(5000);
  }

  value = value();
}

@interactor class DateInputError {
  static defaultScope = '[class^="feedbackError---"]';
  feedbackError = text();
  exist = isPresent();
}

@interactor class UrlInputError {
  static defaultScope = 'div[data-test-report-link-url]'
  feedbackError = text('[class^="feedbackError---"]');
  exist = isPresent('[class^="feedbackError---"]');
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

@interactor class CustomReports {
  static defaultScope = '#data-test-custom-reports';

  instances = collection('[role=row]');
  clickFirstRow = clickable('[id*=custom-report-button-]');
}

@interactor class CustomReportInfo {
  static defaultScope = '[class="custom-report-info"]';
  downloadCustomReportButton = scoped('button[id="download-custom-report-button"]');
  deleteCustomReportButton = scoped('button[id="delete-custom-report-button"]');
  customReportLink = scoped('a[id="custom-report-link"]');
  closeReportInfoButton = scoped('button[id="close-report-info-button"]');
}

@interactor class CounterReports {
  static defaultScope = '#data-test-counter-reports';

  instances = collection('button[id*=clickable-download-stats-by-id]');
  firstReport = scoped('[id*=clickable-download-stats-by-id-]');
  firstReportButton = clickable('[id*=clickable-download-stats-by-id-]');
}

@interactor class CounterReportInfo {
  static defaultScope = '[id="report-info"]';

  reportEditedManuallyInfo = scoped('[data-test-custom-reports-edited-manually]');
}


@interactor class ConfirmDeleteButton {
  static defaultScope = 'button[data-test-confirmation-modal-confirm-button]';
}

@interactor class UploadCounterModal {
  static defaultScope = '[id="upload-counter-modal"]';

  selectFileButton = scoped('button[id="upload-file-button"]');
  reportEditedManuallyCheckbox = scoped('[id="addcounterreport_reportEditedManually"]');
  editReasonTextfield = scoped('[id="addcounterreport_editReason"]');
  uploadFileButton = scoped('button[id="upload-report-button"]');
  uploadFileButtonIsDisabled = is('button[id="upload-report-button"]', ':disabled');
  uploadCounterCancelButton = scoped('button[id="cancel-upload-counter-report"]');
}

@interactor class UploadNonCounterModal {
  static defaultScope = '[class="upload-non-counter-modal"]';
  uploadFileButton = scoped('button[id="upload-file-button"]');
  fileRadioButton = scoped('label[for="custom-report-file-radio"]');
  linkRadioButton = scoped('label[for="custom-report-link-radio"]');
  yearInput = scoped('input[id="custom-report-year"]');
  linkUrlInput = scoped('input[id="custom-report-link-url"]');
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
  startDateDownloadInput = new StartDateDownloadInput();
  endDateDownloadInput = new EndDateDownloadInput();
  dateInputError = new DateInputError();
  reportTypeDownloadSelect = new ReportTypeDownloadSelect();
  dataTypeDownloadSelect = new DataTypeDownloadSelect();
  expandAll = new ExpandAll();
  harvesterImpls = text('[data-test-service-type]');
  lastHarvesting = text('[data-test-last-harvesting]');
  validReport = clickable('#clickable-download-stats-by-id-BR1-2018-01');
  failedReport = clickable('#clickable-download-stats-by-id-BR1-2018-02');
  reportInfoValid = new ReportInfoValid();
  reportInfoFailed = new ReportInfoFailed();
  harvestingAccordionButton = new HarvestingAccordionButton();
  notesAccordionButton = new NotesAccordionButton();
  startHarvesterButton = new StartHarvesterButton();
  clickCustomReportAccordion = clickable('#custom-reports-accordion');
  clickExpandAllCustomReportYears = clickable('#expand-all-custom-report-years');
  customReports = new CustomReports();
  customReportInfo = new CustomReportInfo();

  clickStatisticsAccordion = clickable('#accordion-toggle-button-statisticsAccordion');
  counterReportAccordion = scoped('[id="accordion-toggle-button-counter-reports-accordion"]');
  clickCounterReportAccordion = clickable('#counter-reports-accordion');
  clickExpandAllCounterReportYears = clickable('#expand-all-counter-report-years');
  counterReports = new CounterReports();
  counterReportInfo = new CounterReportInfo();

  uploadCounterModal = new UploadCounterModal();
  uploadNonCounterModal = new UploadNonCounterModal();
  clickUploadCounterButton = clickable('#upload-counter-button');
  clickUploadNonCounterButton = clickable('#upload-non-counter-button');

  clickShowTags = clickable('#clickable-show-tags');
  tagsSelect = new TagsSelect();

  confirmDeleteButton = new ConfirmDeleteButton();
  fileUploaderInteractor = new FileUploaderInteractor();
  downloadFileButton = new DownloadFileButton();
  urlInputError = new UrlInputError();
}
