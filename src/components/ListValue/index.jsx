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
