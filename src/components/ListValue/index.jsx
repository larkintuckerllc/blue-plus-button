import React from 'react';
import PropTypes from 'prop-types';

const ListValue = ({ fldListValue }) => (
  <li>{fldListValue}</li>
);
ListValue.propTypes = {
  fldListValue: PropTypes.string.isRequired,
}
export default ListValue;
