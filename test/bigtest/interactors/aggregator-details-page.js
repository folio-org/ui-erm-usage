
import {
  interactor
} from '@bigtest/interactor';

@interactor class GeneralInfoAccordion {
  static defaultScope = '#generalInformation';
}

@interactor class AggregatorConfigAccordion {
  static defaultScope = '#aggregatorConfig';
}

@interactor class AccountConfigAccordion {
  static defaultScope = '#accountConfig';
}

export default @interactor class AggregatorDetailsPage {
  static defaultScope = '[data-test-aggregator-details]';
  generalInfoAccordion = new GeneralInfoAccordion();
  aggregatorConfigAccordion = new AggregatorConfigAccordion();
  accountConfigAccordion = new AccountConfigAccordion();
}
