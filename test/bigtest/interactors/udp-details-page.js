
import {
  interactor,
  text
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

export default @interactor class UDPDetailsPage {

  static defaultScope = '#pane-udpdetails';
  title = text('[data-test-header-title]');
  harvestingAccordion = new HarvestingAccordion();
  sushiCredentialsAccordion = new SushiCredentialsAccordion();
  notesAccordion = new NotesAccordion();
  statisticsAccordion = new StatisticsAccordion();
  uploadAccordion = new UploadAccordion();
}
