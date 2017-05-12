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
