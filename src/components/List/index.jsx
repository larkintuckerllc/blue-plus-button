import React from 'react';
import PropTypes from 'prop-types';

const List = ({ children }) => (
  <ul id="list">
    {children}
  </ul>
);
List.propTypes = {
  children: PropTypes.node,
}
export default List;
