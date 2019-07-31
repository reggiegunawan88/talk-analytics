import React from 'react';

import PropTypes from 'prop-types';

const TablePlaceholder = ({ totalCol, children }) =>
  <tbody>
    <tr>
      <td colSpan={totalCol}>
        {children}
      </td>
    </tr>
  </tbody>;

export default TablePlaceholder;

/* eslint-disable */
TablePlaceholder.propTypes = {
  totalCol: PropTypes.number,
  children: PropTypes.any,
};
/* eslint-enable */

TablePlaceholder.defaultProps = {
  totalCol: 0,
  children: {},
};
