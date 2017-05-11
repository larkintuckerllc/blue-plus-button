import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import appBlocking from './ducks/appBlocking';
import App from './App';
import './index.css';

const reducers = combineReducers({
  appBlocking,
});
const store = createStore(reducers);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
