import React from 'react';
import { Provider } from 'react-redux';
import {
  combineReducers,
  createStore
} from 'redux';
import {
  reducer as formReducer,
  reduxForm
} from 'redux-form';

export const withReduxForm = (component, initialStateValues = {}, formFieldValues = {}) => {
  const onSubmit = jest.fn();
  const fieldReducer = (state = initialStateValues) => state;
  const reducer = combineReducers({
    field: fieldReducer,
    form: formReducer,
  });
  const store = createStore(reducer);

  const Decorated = reduxForm({
    form: 'testForm',
    onSubmit: { onSubmit },
  })(() => component);

  return (
    <Provider store={store}>
      <Decorated {...formFieldValues} />
    </Provider>
  );
};
