# Blue Plus Button

## Introduction

The purpose of this project is to provide a simple React / Redux application
illustrating the full suite of CRUD (Create Read Update and Delete) operations.

Also provided is rough step-by-step instructions on the building of this
project.

## Installation

The system requirements are:

* Node.js <https://nodejs.org/en/>
* Yarn <https://github.com/yarnpkg/yarn>
* Chrome browser
* Redux DevTools (Chrome Extension) <https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd>

Download and expand into a directory. From within that direction run:

`yarn install`

## Usage

To run the boilerplate, run the following from the installation directory
and open web browser to <http://localhost:3000>.

`yarn start`

## Step-By-Step Instructions

**Create React App**

This example uses the Create React App generator to provide the React
development environment; follow instructions to create the project.

<https://github.com/facebookincubator/create-react-app>

**Strip Down Generated Application**

Next we will want to strip down the generated application to a barebones
React application, i.e.,

* Delete *src/logo.svg*
* Remove contents of *src/App.css* and *src/index.css*.
* Update *src/App.js* to be as follows:

*src/App.js*
```
import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>Hello World</div>
    );
  }
}
export default App;
```

**Add Minimal Redux Implementation to Project**

Next we add a minimal Redux implementation to project.

```
yarn add redux
yarn add react-redux
```

Using the Ducks pattern, <https://github.com/erikras/ducks-modular-redux>,
create a duck named *appBlocking* that will store a boolean state; will be
used to block the user interface with a cover and spinner (a good idea when
you have asynchronous operations). For example...

*src/strings.js*

<https://github.com/larkintuckerllc/blue-plus-button/blob/master/src/strings.js>

*src/ducks/appBlocking.js*

<https://github.com/larkintuckerllc/blue-plus-button/blob/master/src/ducks/appBlocking.js>

*src/index.js*
```
import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore } from 'redux';
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
```

**Use appBlocking to Display a Cover and Spinner for a Few Seconds**

Since we want the application to start displaying cover and spinner
and hide once the data has been fetched, we will simulate this
by setting a few second timeout to hide the cover and spinner.

```
yarn add prop-types
```

*src/components/Blocking/index.jsx*

<https://github.com/larkintuckerllc/blue-plus-button/blob/master/src/components/Blocking/index.jsx>

*src/components/Blocking/index.css*

<https://github.com/larkintuckerllc/blue-plus-button/blob/master/src/components/Blocking/index.css>

*src/App.js*
```
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import * as fromAppBlocking from './ducks/appBlocking';
import Blocking from './components/Blocking';
import './App.css';

class App extends Component {
  componentDidMount() {
    const { setAppBlocking } = this.props;
    window.setTimeout(() => setAppBlocking(false), 2000);
  }
  render() {
    const { appBlocking } = this.props;
    return (
      <div>
        { appBlocking && <Blocking />}
        <div>Hello World</div>
      </div>
    );
  }
}
App.propTypes = {
  appBlocking: PropTypes.bool.isRequired,
  setAppBlocking: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    appBlocking: fromAppBlocking.getAppBlocking(state),
  }), {
    setAppBlocking: fromAppBlocking.setAppBlocking,
  }
)(App);
```

**Enable Redux DevTools Extension**

The easiest way to get the Redux DevTools is with the Chrome
Extension with the updated code.

Updated portion of *src/index.js*
```
...
const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
...
```

**Implement Read Operation**

```
yarn add normalizr
yarn add reselect
yarn add redux-thunk
```

*src/index.js*
```
import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import appBlocking from './ducks/appBlocking';
import listValues from './ducks/listValues';
import App from './App';
import './index.css';

const reducers = combineReducers({
  appBlocking,
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
```

*src/apis/listValues*
```
const fakeDatabase = [{
  fldListValue: 'Other kind of nuts',
  fldSortOrder: 1,
}, {
  fldListValue: 'Peanuts',
  fldSortOrder: 0,
}];
const delay = (ms) =>
  new Promise(resolve => window.setTimeout(resolve, ms));
export const get = () => delay(2000)
  .then(() => fakeDatabase.map(o => ({ ...o })));
export const post = () => {}; // TODO: LATER
export const update = () => {}; // TODO: LATER
export const del = () => {}; // TODO: LATER
```

*src/ducks/listValues*

<https://github.com/larkintuckerllc/blue-plus-button/blob/master/src/ducks/listValues.js>

*/src/components/List/index.jsx*

<https://github.com/larkintuckerllc/blue-plus-button/blob/master/src/components/List/index.jsx>

*/src/components/ListValue/index.jsx*

<https://github.com/larkintuckerllc/blue-plus-button/blob/master/src/components/ListValue/index.jsx>

*src/App.js*
```
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import * as fromAppBlocking from './ducks/appBlocking';
import * as fromListValues from './ducks/listValues';
import Blocking from './components/Blocking';
import List from './components/List';
import ListValue from './components/ListValue';
import './App.css';

class App extends Component {
  componentDidMount() {
    const { fetchListValues, setAppBlocking } = this.props;
    fetchListValues().then(
      () => { setAppBlocking(false); },
      error => {
        setAppBlocking(false);
        // IMPORTANT AS RUNTIME ERRORS IN COMPONENT LIFECYCLE
        // WILL SHOW UP AS AN ERROR HERE
        if (process.env.NODE_ENV !== 'production'
          && error.name !== 'ServerException') {
          window.console.log(error);
        }
       }
    );
  }
  render() {
    const { appBlocking, listValues } = this.props;
    return (
      <div>
        { appBlocking && <Blocking />}
        <List>
          {listValues.sort((a, b) => a.fldSortOrder - b.fldSortOrder).map(o => (
            <ListValue
              key={o.fldListValue}
              fldListValue={o.fldListValue}
            />
          ))}
        </List>
      </div>
    );
  }
}
App.propTypes = {
  appBlocking: PropTypes.bool.isRequired,
  fetchListValues: PropTypes.func.isRequired,
  listValues: PropTypes.array.isRequired,
  setAppBlocking: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    appBlocking: fromAppBlocking.getAppBlocking(state),
    listValues: fromListValues.getListValues(state),
  }), {
    setAppBlocking: fromAppBlocking.setAppBlocking,
    fetchListValues: fromListValues.fetchListValues,
  }
)(App);
```

**Implement Add Operation**

```
yarn add redux-form
```

Updates to *src/index.jsx*
```
...
import { reducer as formReducer } from 'redux-form';
...
const reducers = combineReducers({
  appBlocking,
  form: formReducer,
  listValues,
});
...
```

*src/components/Add/index.jsx*

<https://github.com/larkintuckerllc/blue-plus-button/tree/master/src/components/Add>

Updates to *src/App.js*
```
...
import Add from './components/Add';
...
{appBlocking && <Blocking />}
<Add />
<List>
...
```

**Implement Select (for Deleting and Updating)**

*src/ducks/listValueSelected.js*

<https://github.com/larkintuckerllc/blue-plus-button/blob/master/src/ducks/listValueSelected.js>

Updates to *src/index.js*
```
...
import listValueSelected from './ducks/listValueSelected';
...
const reducers = combineReducers({
  ...
  listValueSelected,
});
...
```

Updates to *src/App.js*
```
const { appBlocking, listValues, listValueSelected, setListValueSelected } = this.props;
return (
  <div>
    ...
    {listValueSelected === null && <Add />}
        <ListValue
          ...
          listValueSelected={listValueSelected}
          setListValueSelected={setListValueSelected}
          ...
App.propTypes = {
  ...
  listValueSelected: PropTypes.string,
  ...
  setListValueSelected: PropTypes.func.isRequired,
  ...
  state => ({
    ...
    listValueSelected: fromListValueSelected.getListValueSelected(state),
  }), {
    ...
    setListValueSelected: fromListValueSelected.setListValueSelected,
    ...
```

Updates to *src/components/ListValue/index.jsx*
```
import React from 'react';
import PropTypes from 'prop-types';

const ListValue = ({ fldListValue, listValueSelected, setListValueSelected }) => (
  <li
    style={{
      backgroundColor: listValueSelected === fldListValue ? 'yellow' : 'transparent'
    }}
    onClick={() => setListValueSelected(fldListValue)}
  >{fldListValue}</li>
);
ListValue.propTypes = {
  fldListValue: PropTypes.string.isRequired,
  listValueSelected: PropTypes.string,
  setListValueSelected: PropTypes.func.isRequired,
}
export default ListValue;
```

**Implement Deleting**

Ran out of steam on documentation...

*src/components/Delete/index.jsx*

Updated *src/App.js*

Updated *src/api/listValues.js*

**Implement Change**

Ran out of steam on documentation...

## License

This project is licensed under the MIT License.
