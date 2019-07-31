import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { getForm, getFormData } from 'Modules/formChat';
import Page from 'shared_components/Page';
import Pagination from 'shared_components/Pagination';
import getFormState from './selector';
import styles from './styles.scss';

const mapStateToProps = state => {
  const stateProps = getFormState(state);
  return stateProps;
}
class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formSizePage: 5,
      pagination: {
        page: 1,
        size: 20,
      },
      listForm: [],
    };
  }

  async componentDidMount() {
    await this.props.getForm(this.state.pagination);
    this.setState({ listForm: this.props.listForm });
  }

  async paginationAction(type, id) {
    const newValue = this.state;
    const findData = newValue.listForm.find(f => f.id === id);
    const indexData = newValue.listForm.findIndex(f => f.id === id);
    if (type === 'next') {
      findData.currentPage += 1;
    } else {
      findData.currentPage -= 1;
    }

    newValue.listForm[indexData] = findData;
    this.setState(newValue);

    if ( findData.currentPage === Math.ceil((findData.formPagination.page * findData.formPagination.size) / this.state.formSizePage)) {
      findData.formPagination.page += 1;
      await this.props.getFormData(id, findData.currentPage, findData.formPagination);
    }
  }

  render() {
    return (
      <Page>
        <h2 className={styles['c-page__title']}>
          <FormattedMessage id="form.titlePage" />
        </h2>
        <div className={styles['form__type-all']}>
          {this.state.listForm.map(form => {
            const firstLimit = (form.currentPage - 1) * this.state.formSizePage;
            const lastLimit = (form.currentPage * this.state.formSizePage) - 1;
            return (
            <div key={form.id} className={styles['form__type-single']}>
              <h3>{form.title}</h3>
              {form.data.length ? (
              <div>
                <table className="table no-footer">
                  <thead>
                    <tr>
                      <th className={`text-center ${styles["w-40px"]}`} key={`${form.id}-h0`}>#</th>
                      {form.column.map((data,idx) => (
                        <th key={`${form.id}-h${idx+1}}`}>{data.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {form.data.map((data, cnt) => cnt >= firstLimit && cnt <= lastLimit && (
                        <tr key={`${form.id}-${cnt+1}`}>
                          <td className="text-center" key={`${form.id}-b0`}>{cnt+1}</td>
                          {form.column.map((column,idx) => (
                            <td key={`${form.id}-b${idx+1}`}>{data[column.value]}</td>
                          ))}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                <div className={styles['form__type-pagination']}>
                  <Pagination totalElement={form.totalData} currentPage={form.currentPage} sizePage={this.state.formSizePage} onClickPrev={() => this.paginationAction('prev',form.id)} onClickNext={() => this.paginationAction('next',form.id)} />
                </div>
              </div>
              ) : (<div className={`alert alert-warning text-center ${styles['form__type-nodata']}`}><FormattedMessage id="form.emptyList" /></div>)}
            </div>
            )
          })}
        </div>
      </Page>
    );
  }
}

export default connect(mapStateToProps, { getForm, getFormData })(Form);

/* eslint-disable */
Form.propTypes = {
  isFetching: PropTypes.bool.isRequired, 
  hasMoreData: PropTypes.bool.isRequired,
  listForm: PropTypes.array,
  getForm: PropTypes.func.isRequired,
  getFormData: PropTypes.func.isRequired,
}
/* eslint-enable */

Form.defaultProps = {
  listForm: [],
}
