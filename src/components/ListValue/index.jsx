import React from 'react';
import PropTypes from 'prop-types';

const ListValue = ({ fldListValue, listValueSelected, resetChangeForm, setListValueSelected }) => (
  <li
    style={{
      backgroundColor: listValueSelected === fldListValue ? 'yellow' : 'transparent'
    }}
    onClick={() => {
      setListValueSelected(fldListValue);
      resetChangeForm();
    }}
  >{fldListValue}</li>
);
ListValue.propTypes = {
  fldListValue: PropTypes.string.isRequired,
  listValueSelected: PropTypes.string,
  resetChangeForm: PropTypes.func.isRequired,
  setListValueSelected: PropTypes.func.isRequired,
}
export default ListValue;
