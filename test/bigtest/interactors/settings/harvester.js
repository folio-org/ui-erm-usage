import {
  clickable,
  interactor,
  isPresent,
  property
} from '@bigtest/interactor';

@interactor class MaxFailedAttempts {
  static defaultScope = '#maxFailedAttempts';
}

export default @interactor class HarvesterSettingsInteractor {
  static defaultScope = '[data-test-settings-harvester-config]';

  hasMaxFailedAttempts = isPresent('#maxFailedAttempts');

  clickSaveConfig = clickable('#clickable-save-config');
  isDisabledClickAndSave = property('#clickable-save-config', 'disabled');

  maxFailedAttempts = new MaxFailedAttempts();
}
