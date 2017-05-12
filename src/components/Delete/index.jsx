import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { reduxForm, reset, SubmissionError } from 'redux-form';
import * as fromListValues from '../../ducks/listValues';
import * as fromAppBlocking from '../../ducks/appBlocking';
import * as fromListValueSelected from '../../ducks/listValueSelected';

const DELETE_FORM = 'DELETE_FORM';
const Delete = ({ handleSubmit, submitFailed, submitting, valid }) => (
  <form onSubmit={handleSubmit}>
    {submitFailed && !submitting && <div>Failed to delete.</div>}
    <button
      disabled={!valid || submitting}
      type="submit"
    >Delete</button>
  </form>
);
Delete.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};
const DeleteForm = reduxForm({
  form: DELETE_FORM,
})(Delete);
class DeleteSubmit extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit() {
    const { listValueSelected, removeListValue, resetForm, resetListValueSelected, setAppBlocking } = this.props;
    setAppBlocking(true);
    return removeListValue(listValueSelected)
    .then(
      () => {
        resetForm();
        resetListValueSelected();
        setAppBlocking(false);
      },
      error => {
        if (process.env.NODE_ENV !== 'production'
          && error.name !== 'ServerException') {
          window.console.log(error);
          return;
        }
        setAppBlocking(false);
        throw new SubmissionError({});
      }
    );
  }
  render() {
    return (
      <DeleteForm
        onSubmit={this.handleSubmit}
      />
    );
  }
}
DeleteSubmit.propTypes = {
  listValueSelected: PropTypes.string.isRequired,
  resetForm: PropTypes.func.isRequired,
  removeListValue: PropTypes.func.isRequired,
  resetListValueSelected: PropTypes.func.isRequired,
  setAppBlocking: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    listValueSelected: fromListValueSelected.getListValueSelected(state),
  }), {
    removeListValue: fromListValues.removeListValue,
    resetForm: () => reset(DELETE_FORM),
    resetListValueSelected: fromListValueSelected.resetListValueSelected,
    setAppBlocking: fromAppBlocking.setAppBlocking,
  }
)(DeleteSubmit);
