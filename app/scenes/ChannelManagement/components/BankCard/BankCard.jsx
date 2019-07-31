import React, { Component } from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import Modal from 'react-responsive-modal';

import { configValues } from 'Config';
import cloneDeep from 'lodash/cloneDeep';
import PropTypes from 'prop-types';

import Input from 'shared_components/Input';
import Button from 'shared_components/Button';
import Dropdown from 'shared_components/Dropdown';
import { formattedMessageHelper } from 'Modules/helper/utility';
import {
  addBank,
  getBanks,
  updateBank,
  deleteBank,
} from 'Modules/bank';
import getBankState from './selector';
import styles from './styles.scss';

const mapStateToProps = state => {
  const stateProps = getBankState(state);
  return stateProps;
};

class BankCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      action: 'add',
      bankInfo: {},
      isModalOpen: false,
    };

    this.onDropdownChange = this.onDropdownChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.submit = this.submit.bind(this);
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    this.props.getBanks();
  }

  onDropdownChange(name, { value, label }) {
    const newValue = cloneDeep(this.state);
    newValue.bankInfo[name] = value;
    newValue.bankInfo.label = label;
    this.setState(newValue);
  }

  onChange(e) {
    const newValue = cloneDeep(this.state);
    const { name, value } = e;
    newValue.bankInfo[name] = value;
    this.setState(newValue);
  }

  openModal() {
    this.setState({ isModalOpen: true });
  }

  closeModal() {
    this.setState({ action: 'add', isModalOpen: false, bankInfo: {} });
  }

  edit(bank) {
    this.setState({
      isModalOpen: true,
      bankInfo: bank,
      action: 'edit',
    });
  }

  delete(bank) {
    const aggree = window.confirm('You want to delete?');
    if (aggree) this.props.deleteBank(bank._id);
  }

  submit(e) {
    e.preventDefault();

    this.props.addBank(this.state.bankInfo).then(() => {
      this.closeModal();
      this.props.getBanks();
    });
  }

  update(e) {
    e.preventDefault();
    this.props.updateBank(this.state.bankInfo).then(() => {
      this.closeModal();
      this.props.getBanks();
    });
  }

  handleView() {
    if (this.props.banks.length > 0) {
      return (
        <div className={styles['bank-table__container']}>
          <table className="table">
            <thead>
              <tr>
                <th>
                  <FormattedMessage id="profile.bankName" />
                </th>
                <th>
                  <FormattedMessage id="profile.accountName" />
                </th>
                <th>
                  <FormattedMessage id="profile.accountNumber" />
                </th>
                <th>&nbsp;</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {this.props.banks.map(bank => (
                <tr key={bank.createdat}>
                  <td>{bank.label || bank.bank_name}</td>
                  <td>{bank.bank_account}</td>
                  <td>{bank.bank_number}</td>
                  <td>
                    <Button
                      className="btn-primary btn-ghost"
                      onClick={() => this.edit(bank)}
                    >
                      <FormattedMessage id="profile.edit" />
                    </Button>
                  </td>
                  <td>
                    <Button
                      className="btn-primary btn-ghost"
                      onClick={() => this.delete(bank)}
                    >
                      <FormattedMessage id="profile.delete" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="alert alert-warning">
        <FormattedHTMLMessage id="profile.noBank" />
      </div>
    );
  }

  render() {
    const { isFetching } = this.props;

    return (
      <div className="panel panel-transparent">
        <div className={`panel-body ${styles['panel--responsive']}`}>
          <b className="display-inline-block m-t-10 fs-16">
            <FormattedMessage id="profile.bankAccount" />
          </b>
          <Button
            className={`btn-primary btn-ghost ${styles.btn__add}`}
            onClick={this.openModal}
          >
            <i className="fa fa-plus" />{' '}
            <FormattedMessage id="profile.bankAccount" />
          </Button>
          <hr />

          {this.handleView()}
        </div>

        <Modal
          classNames={{ modal: styles['bank-card--modal'] }}
          open={this.state.isModalOpen}
          onClose={this.closeModal}
          center
        >
          {this.state.action === 'add' ? (
            <b>
              <FormattedMessage id="profile.addBank" />
            </b>
          ) : (
            <b>
              <FormattedMessage id="profile.editBank" />
            </b>
          )}

          <p className="fg-shade m-t-20">
            <FormattedMessage id="profile.fillForm" />
          </p>

          <form
            onSubmit={this.state.action === 'add' ? this.submit : this.update}
          >
            <Dropdown
              onChange={this.onDropdownChange}
              label={formattedMessageHelper('profile.bankName')}
              options={configValues.BANK_DEFAULT}
              className="m-b-10"
              base={{
                name: 'bank_name',
                required: true,
                value: this.state.bankInfo.bank_name || '',
                isLoading: isFetching,
              }}
            />

            <Input
              onChange={this.onChange}
              label={formattedMessageHelper('profile.accountName')}
              styles="form-group-default"
              base={{
                name: 'bank_account',
                value: this.state.bankInfo.bank_account || '',
                disabled: isFetching,
              }}
              required
            />

            <Input
              onChange={this.onChange}
              label={formattedMessageHelper('profile.accountNumber')}
              styles="form-group-default"
              base={{
                name: 'bank_number',
                value: this.state.bankInfo.bank_number || '',
                disabled: isFetching,
              }}
              required
            />

            {this.state.action === 'add' ? (
              <Button
                className="btn-primary btn-block m-t-20"
                isLoading={isFetching}
              >
                <FormattedMessage id="profile.add" />
              </Button>
            ) : (
              <Button
                className="btn-primary btn-block m-t-20"
                isLoading={isFetching}
              >
                <FormattedMessage id="profile.save" />
              </Button>
            )}
          </form>
        </Modal>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  { getBanks, addBank, updateBank, deleteBank }
)(BankCard);

/* eslint-disable */
BankCard.propTypes = {
  addBank: PropTypes.func.isRequired,
  getBanks: PropTypes.func.isRequired,
  updateBank: PropTypes.func.isRequired,
  deleteBank: PropTypes.func.isRequired,
  banks: PropTypes.array,
  isFetching: PropTypes.bool.isRequired,
};
/* eslint-enable */

BankCard.defaultProps = {
  banks: [],
};
