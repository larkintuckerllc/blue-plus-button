import React from 'react';
import ReactDOM from 'react-dom';
import { reducer as formReducer } from 'redux-form';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import appBlocking from './ducks/appBlocking';
import listValues from './ducks/listValues';
import App from './App';
import './index.css';

const reducers = combineReducers({
  appBlocking,
  form: formReducer,
  listValues,
});
const middleware = [thunk];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducers,
  composeEnhancers(
    applyMiddleware(...middleware)
  )
);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
