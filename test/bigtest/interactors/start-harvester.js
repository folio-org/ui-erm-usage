import {
  interactor,
  isPresent
} from '@bigtest/interactor';

export default @interactor class StartHarvester {
  static defaultScope = '#start-harvester-pane';
  startButton = isPresent('#start-harvester');
}
