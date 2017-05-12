import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import * as fromAppBlocking from './ducks/appBlocking';
import * as fromListValues from './ducks/listValues';
import * as fromListValueSelected from './ducks/listValueSelected';
import { CHANGE_FORM } from './components/Change';
import Blocking from './components/Blocking';
import List from './components/List';
import ListValue from './components/ListValue';
import Add from './components/Add';
import Change from './components/Change';
import Delete from './components/Delete';
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
    const { appBlocking, listValues, listValueSelected, resetChangeForm, setListValueSelected } = this.props;
    return (
      <div>
        {appBlocking && <Blocking />}
        {listValueSelected === null && <Add />}
        {listValueSelected !== null && <Change />}
        {listValueSelected !== null && <Delete />}
        <List>
          {listValues.sort((a, b) => a.fldSortOrder - b.fldSortOrder).map(o => (
            <ListValue
              key={o.fldListValue}
              fldListValue={o.fldListValue}
              listValueSelected={listValueSelected}
              resetChangeForm={resetChangeForm}
              setListValueSelected={setListValueSelected}
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
  listValueSelected: PropTypes.string,
  resetChangeForm: PropTypes.func.isRequired,
  setAppBlocking: PropTypes.func.isRequired,
  setListValueSelected: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    appBlocking: fromAppBlocking.getAppBlocking(state),
    listValues: fromListValues.getListValues(state),
    listValueSelected: fromListValueSelected.getListValueSelected(state),
  }), {
    fetchListValues: fromListValues.fetchListValues,
    resetChangeForm: () => reset(CHANGE_FORM),
    setAppBlocking: fromAppBlocking.setAppBlocking,
    setListValueSelected: fromListValueSelected.setListValueSelected,
  }
)(App);
