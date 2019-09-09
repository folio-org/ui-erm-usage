import {
  clickable,
  interactor,
  isPresent,
  value
} from '@bigtest/interactor';

@interactor class NotDefined {
  static defaultScope = '#periodic-harvesting-config-not-defined';
}

@interactor class PeriodicIntervalSelect {
  static defaultScope = 'select[id="periodic-harvesting-interval"]';
  value = value();
}

export default @interactor class PeriodicHarvestingConfig {
  static defaultScope = '#periodic-harvesting-pane';
  notDefined = new NotDefined();
  clickOpenEdit = clickable('#clickable-open-edit-config');
  clickDeleteConfig = isPresent('#clickable-delete-config');
  clickSaveConfig = clickable('#save-config');
  editForm = isPresent('#form-periodic-harvesting');
  detailView = isPresent('#periodic-harvesting-detail-view');
  periodicIntervalSelect = new PeriodicIntervalSelect();
}
