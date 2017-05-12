import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { Field, reduxForm, reset, SubmissionError } from 'redux-form';
import * as fromListValues from '../../ducks/listValues';
import * as fromAppBlocking from '../../ducks/appBlocking';

const ADD_FORM = 'ADD_FORM';
const Add = ({ handleSubmit, submitFailed, submitting, valid }) => (
  <form onSubmit={handleSubmit}>
    <Field
      component="input"
      disabled={submitting}
      name="fldListValue"
      placeholder="fldListValue"
      type="text"
    />
    {submitFailed && !submitting && <div>Failed to add.</div>}
    <button
      disabled={!valid || submitting}
      type="submit"
    >Add</button>
  </form>
);
Add.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
};
const AddForm = reduxForm({
  form: ADD_FORM,
  validate: (values, props) => {
    const { listValues } = props;
    const errors = {};
    if (values.fldListValue === undefined) errors.fldListValue = true;
    if (listValues.find(o => o.fldListValue === values.fldListValue) !== undefined) {
      errors.fldListValue = true;
    }
    return errors;
  }
})(Add);
class AddSubmit extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit({ fldListValue }) {
    const { addListValue, resetForm, setAppBlocking } = this.props;
    setAppBlocking(true);
    return addListValue({
      fldListValue,
    }).then(
      () => {
        resetForm();
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
    const { listValues } = this.props;
    return (
      <AddForm
        listValues={listValues}
        onSubmit={this.handleSubmit}
      />
    );
  }
}
AddSubmit.propTypes = {
  addListValue: PropTypes.func.isRequired,
  listValues: PropTypes.array.isRequired,
  resetForm: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    listValues: fromListValues.getListValues(state),
  }), {
    addListValue: fromListValues.addListValue,
    resetForm: () => reset(ADD_FORM),
    setAppBlocking: fromAppBlocking.setAppBlocking,
  }
)(AddSubmit);
