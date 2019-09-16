import {
  clickable,
  collection,
  interactor,
  scoped,
  text,
  isPresent,
  value,
} from '@bigtest/interactor';

@interactor class ServiceTypeSelect {
  static defaultScope = 'select[name="serviceType"]';
  value = value();
}

@interactor class AccountConfigTypeSelect {
  static defaultScope = 'select[name="accountConfig.configType"]';
  value = value();
}

export default @interactor class AggregatorEditPage {
  static defaultScope = '#form-aggregator-setting';
  isLoaded = isPresent('[class*=paneTitleLabel---]');

  whenLoaded() {
    return this.when(() => this.isLoaded);
  }

  title = text('[class*=paneTitleLabel---]');
  serviceTypeSelect = new ServiceTypeSelect();
  accountConfigTypeSelect = new AccountConfigTypeSelect();

  clickAddConfigParam = clickable('#add-agg-config-param-add-button');
  clickRemoveConfigParam = clickable('#add-agg-config-param > ul > li:nth-child(2) > * > button');

  configParams = collection('#add-agg-config-param > ul');

  aggConfigFirstKey = scoped('#aggregator-conf-input-key-0');
  aggConfigFirstVal = scoped('#aggregator-conf-input-value-0');
}
