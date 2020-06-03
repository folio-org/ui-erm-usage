import {
  interactor,
  scoped,
  collection,
  clickable
} from '@bigtest/interactor';

import MultiSelectFilterInteractor from './filters';

export default @interactor class UDPInteractor {
  static defaultScope = '[data-test-udp-instances]';

  instances = collection('[role=row]');
  clickFirstRow = clickable('a[aria-rowindex="2"]');

  instance = scoped('#pane-udpdetails');
  errorCodesFilter = scoped('#clickable-error-codes-filter', MultiSelectFilterInteractor)
}
