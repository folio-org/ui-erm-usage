
import {
  interactor,
  scoped,
  collection,
  clickable
} from '@bigtest/interactor';

export default @interactor class UDPInteractor {
  static defaultScope = '[data-test-udp-instances]';
  clickActiveUDPsCheckbox = clickable('#clickable-filter-harvesting-status-active');

  instances = collection('[role=row] a');

  instance = scoped('#pane-udpdetails');
}
