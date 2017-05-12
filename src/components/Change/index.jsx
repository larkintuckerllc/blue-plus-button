import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import * as fromListValues from '../../ducks/listValues';
import * as fromAppBlocking from '../../ducks/appBlocking';
import * as fromListValueSelected from '../../ducks/listValueSelected';

export const CHANGE_FORM = 'CHANGE_FORM';
const Change = ({ handleSubmit, submitFailed, submitting, valid }) => (
  <form onSubmit={handleSubmit}>
    <Field
      component="input"
      disabled={submitting}
      name="fldListValue"
      placeholder="fldListValue"
      type="text"
    />
    {submitFailed && !submitting && <div>Failed to change.</div>}
    <button
      disabled={!valid || submitting}
      type="submit"
    >Change</button>
  </form>
);
Change.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};
const ChangeForm = reduxForm({
  form: CHANGE_FORM,
  validate: (values, props) => {
    const { listValues } = props;
    const errors = {};
    if (values.fldListValue === '') errors.fldListValue = true;
    if (listValues.find(o => o.fldListValue === values.fldListValue) !== undefined) {
      errors.fldListValue = true;
    }
    return errors;
  }
})(Change);
class ChangeSubmit extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit({ fldListValue }) {
    const { listValueObjSelected, changeListValue, resetListValueSelected, setAppBlocking } = this.props;
    setAppBlocking(true);
    return changeListValue(
      listValueObjSelected.fldListValue,
      {...listValueObjSelected, fldListValue}
    )
    .then(
      () => {
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
    const { listValueObjSelected, listValues } = this.props;
    return (
      <ChangeForm
        onSubmit={this.handleSubmit}
        initialValues={listValueObjSelected}
        listValues={listValues}
      />
    );
  }
}
ChangeSubmit.propTypes = {
  listValueObjSelected: PropTypes.object,
  listValues: PropTypes.array.isRequired,
  changeListValue: PropTypes.func.isRequired,
  resetListValueSelected: PropTypes.func.isRequired,
  setAppBlocking: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    listValueObjSelected:
    fromListValues.getListValue(state, fromListValueSelected.getListValueSelected(state)),
    listValues: fromListValues.getListValues(state),
  }), {
    changeListValue: fromListValues.changeListValue,
    resetListValueSelected: fromListValueSelected.resetListValueSelected,
    setAppBlocking: fromAppBlocking.setAppBlocking,
  }
)(ChangeSubmit);
