import React, {PureComponent} from 'react';

import PropTypes from 'prop-types';

import styles from './styles.scss';

class Pagination extends PureComponent {
  render() {
    const {totalElement, currentPage, sizePage, onClickPrev, onClickNext} = this.props;
    return (
      <div className="dataTables_wrapper">
        <div className="dataTables_info" style={{float: "left"}}>Showing <b>{(currentPage - 1) * sizePage + 1} to {Math.ceil(totalElement / sizePage) <= currentPage ? totalElement : currentPage * sizePage}</b> of {totalElement} entries</div>
        <div className={`dataTables_paginate paging_simple_numbers ${styles.paging}`}>
          <ul>
            <li role="none" className={`paginate_button previous ${currentPage === 1 ? `disabled ${styles['paging-disabled']}` : 'active'}`} onClick={currentPage > 1 && onClickPrev}>
              <a role="none">
                <i className="pg-arrow_left" />
              </a>
            </li>
            <li className="paginate_button active">
              {currentPage}
            </li>
            <li role="none" className={`paginate_button next ${Math.ceil(totalElement / sizePage) <= currentPage  ? `disabled ${styles['paging-disabled']}` : 'active'}`} onClick={currentPage < Math.ceil(totalElement / sizePage) && onClickNext}>
              <a role="none">
                <i className="pg-arrow_right" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Pagination;
  
/* eslint-disable */
Pagination.propTypes = {
  totalElement: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  sizePage: PropTypes.number.isRequired,
  onClickPrev: PropTypes.func.isRequired,
  onClickNext: PropTypes.func.isRequired,
};
/* eslint-enable */
