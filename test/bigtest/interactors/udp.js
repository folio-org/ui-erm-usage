import {
  interactor,
  scoped,
  collection,
  clickable
} from '@bigtest/interactor';

export default @interactor class UDPInteractor {
  static defaultScope = '[data-test-udp-instances]';

  instances = collection('[role=row]');
  clickFirstRow = clickable('[aria-rowindex="2"]');

  instance = scoped('#pane-udpdetails');
}
