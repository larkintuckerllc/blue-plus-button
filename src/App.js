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
