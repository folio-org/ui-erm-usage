import _ from 'lodash';

const calcStateExpandAllAccordions = (currentState, obj) => {
  const newState = _.cloneDeep(currentState);
  newState.accordions = obj;
  return newState;
};

const calcStateToggleAccordion = (currentState, id) => {
  const newState = _.cloneDeep(currentState);
  if (!_.has(newState.accordions, id)) newState.accordions[id] = true;
  newState.accordions[id] = !newState.accordions[id];
  return newState;
};

export { calcStateExpandAllAccordions, calcStateToggleAccordion };
