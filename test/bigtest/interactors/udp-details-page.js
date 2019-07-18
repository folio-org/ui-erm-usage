
import {
  clickable,
  interactor,
  text,
  value,
  scoped
} from '@bigtest/interactor';

@interactor class HarvestingAccordion {
  static defaultScope = '#harvestingAccordion';
}

@interactor class SushiCredentialsAccordion {
  static defaultScope = '#sushiCredsAccordion';
}

@interactor class NotesAccordion {
  static defaultScope = '#notesAccordion';
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

@interactor class ExpandAll {
  static defaultScope = '#clickable-expand-all-view';
}

@interactor class ReportActionMenuValid {
  static defaultScope = '[class="report-action-menu-valid"]';
  downloadJsonXmlButton = scoped('button[id="download-json-xml-button"]');
  deleteButton = scoped('button[id="delete-report-button"]');
}

@interactor class ReportActionMenuFailed {
  static defaultScope = '[class="report-action-menu-failed"]';
  downloadJsonXmlButton = scoped('button[id="download-json-xml-button"]');
  deleteButton = scoped('button[id="delete-report-button"]');
}

export default @interactor class UDPDetailsPage {
  static defaultScope = '#pane-udpdetails';
  title = text('[data-test-header-title]');
  clickEditUDP = clickable('#clickable-edit-udp');
  harvestingAccordion = new HarvestingAccordion();
  sushiCredentialsAccordion = new SushiCredentialsAccordion();
  notesAccordion = new NotesAccordion();
  statisticsAccordion = new StatisticsAccordion();
  uploadAccordion = new UploadAccordion();
  reportTypeDownloadSelect = new ReportTypeDownloadSelect();
  expandAll = new ExpandAll();
  harvesterImpls = text('[data-test-service-type]');
  validReport = clickable('#clickable-download-stats-by-id-2018-01');
  failedReport = clickable('#clickable-download-stats-by-id-2018-02');
  reportActionMenuValid = new ReportActionMenuValid();
  reportActionMenuFailed = new ReportActionMenuFailed();
}
