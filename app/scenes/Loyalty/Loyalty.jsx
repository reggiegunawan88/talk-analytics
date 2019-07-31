import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-responsive-modal';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import cloneDeep from 'lodash/cloneDeep';
import PropTypes from 'prop-types';

import { formattedMessageHelper } from 'Modules/helper/utility';
import Page from 'shared_components/Page';
import Input from 'shared_components/Input';
import Button from 'shared_components/Button';
import {
  addLoyalty,
  getLoyalities,
  updateLoyalty,
  deleteLoyalty,
} from 'Modules/loyalty';
import getLoyaltyState from './selector';
import styles from './styles.scss';

const mapStateToProps = state => {
  const stateProps = getLoyaltyState(state);
  return stateProps;
};

class Loyalty extends Component {
  constructor(props) {
    super(props);

    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);

    this.state = {
      listTitle: {
        add: 'loyalty.addLoyalty',
        edit: 'loyalty.editLoyalty',
        delete: 'loyalty.deleteLoyalty',
      },
      action: 'add',
      loyaltyInfo: {},
      titleModal: 'loyalty.addLoyalty',
      isModalOpen: false,
    };
  }

  componentDidMount() {
    this.props.getLoyalities();
  }

  onChange(e) {
    const newValue = cloneDeep(this.state);
    const { name } = e;
    let { value } = e;
    if (name === 'point' || name === 'spending') {
      value = parseInt(value, 11);
    }
    newValue.loyaltyInfo[name] = value;
    this.setState(newValue);
  }

  showModal(title, dataEdit = {}) {
    this.setState({
      isModalOpen: true,
      action: title,
      titleModal: this.state.listTitle[title],
      loyaltyInfo: dataEdit,
    });
  }

  closeModal() {
    this.setState({ isModalOpen: false });
  }

  submit(e) {
    e.preventDefault();

    this.props.addLoyalty(this.state.loyaltyInfo).then(() => {
      this.closeModal();
      this.props.getLoyalities();
    });
  }

  update(e) {
    e.preventDefault();

    this.props.updateLoyalty(this.state.loyaltyInfo).then(() => {
      this.closeModal();
      this.props.getLoyalities();
    });
  }

  delete() {
    this.props
      .deleteLoyalty(this.state.loyaltyInfo._id)
      .then(() => this.closeModal());
  }

  render() {
    const { isFetching } = this.props;
    return (
      <Page>
        <div className="page__title">
          <h3><FormattedMessage id="loyalty.titlePage" /></h3>
        </div>
        <div className="text-right m-b-20">
          <Button
            className="btn btn-primary btn-cons"
            onClick={() => this.showModal('add')}
          >
            <i className="pg pg-plus m-r-5" />
            <FormattedMessage id="loyalty.addLoyalty" />
          </Button>
        </div>
        <Modal
          classNames={{ modal: styles['c-modal__normal'] }}
          open={this.state.isModalOpen}
          onClose={this.closeModal}
          center
        >
          <b>
            <FormattedMessage id={this.state.titleModal} />
          </b>

          {this.state.action !== 'delete' ? (
            <p className="fg-shade m-t-20">
              <FormattedHTMLMessage id="loyalty.fillForm" />
            </p>
          ) : (
            <div>
              <p className="fg-shade m-t-20">
                <FormattedMessage id="loyalty.deleteAlert" />
              </p>
              <div className="row">
                <div className="col-md-6">
                  <Button
                    className="btn btn-danger btn-block"
                    isLoading={isFetching}
                    onClick={this.delete}
                  >
                    <FormattedMessage id="loyalty.deleteYes" />
                  </Button>
                </div>
                <div className="col-md-6">
                  <Button
                    className="btn btn-primary btn-block btn-ghost"
                    onClick={this.closeModal}
                  >
                    <FormattedMessage id="loyalty.deleteCancel" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {this.state.action !== 'delete' && (
            <form
              className="modal-form"
              onSubmit={this.state.action === 'add' ? this.submit : this.update}
            >
              <Input
                onChange={this.onChange}
                label={formattedMessageHelper('loyalty.loyalClassName')}
                styles="form-group-default"
                base={{
                  type: 'text',
                  name: 'class',
                  value: this.state.loyaltyInfo.class,
                  disabled: isFetching,
                }}
                required
              />
              {this.state.action === 'add' ? (
                <div className="alert alert-warning">
                  <FormattedHTMLMessage id="loyalty.alertAdd" />
                </div>
              ) : null}
              <Input
                label={formattedMessageHelper('loyalty.poin')}
                onChange={this.onChange}
                styles="form-group-default"
                base={{
                  type: 'number',
                  name: 'point',
                  value: this.state.loyaltyInfo.point,
                  disabled: isFetching,
                }}
                required
              />
              <Input
                label={formattedMessageHelper('loyalty.spending')}
                onChange={this.onChange}
                styles="form-group-default"
                base={{
                  type: 'text',
                  name: 'spending',
                  value: this.state.loyaltyInfo.spending,
                  disabled: isFetching,
                }}
                required
              />

              <Button
                className="btn-primary btn-block m-t-20"
                isLoading={isFetching}
              >
                {this.state.action === 'add' ? (
                  <FormattedMessage id="loyalty.add" />
                ) : (
                  <FormattedMessage id="loyalty.edit" />
                )}
              </Button>
            </form>
          )}
        </Modal>
        <table className="table no-footer">
          <thead>
            <tr>
              <th className="w80px">
                <FormattedMessage id="loyalty.no" />
              </th>
              <th>
                <FormattedMessage id="loyalty.loyalClassName" />
              </th>
              <th>
                <FormattedMessage id="loyalty.poin" />
              </th>
              <th>
                <FormattedMessage id="loyalty.spending" />
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            {this.props.loyalities.length > 0 ? (
              this.props.loyalities.map((list, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{list.class}</td>
                  <td>{list.point}</td>
                  <td>{list.spending}</td>
                  <td className="text-right">
                    <Button
                      className="btn btn-link"
                      onClick={() => this.showModal('edit', list)}
                    >
                      <span className="text-primary">
                        <i className="fa fa-pencil m-r-5" />
                        <FormattedMessage id="loyalty.edit" />
                      </span>
                    </Button>
                    <Button
                      className="btn btn-link"
                      onClick={() => this.showModal('delete', list)}
                    >
                      <span className="text-primary">
                        <i className="fa fa-trash m-r-5" />
                        <FormattedMessage id="loyalty.delete" />
                      </span>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr key="1">
                <td colSpan="5" className="text-center">
                  <b>
                    <FormattedMessage id="loyalty.emptyList" />
                  </b>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Page>
    );
  }
}

export default connect(
  mapStateToProps,
  { getLoyalities, addLoyalty, updateLoyalty, deleteLoyalty }
)(Loyalty);

/* eslint-disable */
Loyalty.propTypes = {
  addLoyalty: PropTypes.func.isRequired,
  getLoyalities: PropTypes.func.isRequired,
  updateLoyalty: PropTypes.func.isRequired,
  deleteLoyalty: PropTypes.func.isRequired,
  loyalities: PropTypes.array,
  isFetching: PropTypes.bool.isRequired,
};
/* eslint-enable */

Loyalty.defaultProps = {
  loyalities: [],
};
