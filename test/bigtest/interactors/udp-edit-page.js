import {
  interactor,
  text,
  isPresent,
  value,
} from '@bigtest/interactor';

@interactor class HarvestingStatusSelect {
  static defaultScope = 'select[name="harvestingConfig.harvestingStatus"]';
  value = value();
}

export default @interactor class UDPEditPage {
  static defaultScope = '[data-test-form-page]';
  isLoaded = isPresent('[class*=paneTitleLabel---]');

  whenLoaded() {
    return this.when(() => this.isLoaded);
  }

  title = text('[class*=paneTitleLabel---]');
  harvestingStatusSelect = new HarvestingStatusSelect();
}
