import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import cloneDeep from 'lodash/cloneDeep';
import PropTypes from 'prop-types';

import { configValues } from 'Config';
import Input from 'shared_components/Input';
import Button from 'shared_components/Button';
import Dropdown from 'shared_components/Dropdown';
import Tooltip from 'shared_components/Tooltip';
import { formattedMessageHelper } from 'Modules/helper/utility';
import styles from './styles.scss';

class TransactionData extends Component {
  constructor(props) {
    super(props);

    const { channelData: { plan, bank } } = this.props;
    this.state = {
      plan: plan || 'enterprise',
      label: bank ? bank.label : '',
      bankName: bank ? bank.bank_name : '',
      bankNumber: bank ? bank.bank_number : '',
      bankAccount: bank ? bank.bank_account : '',
      plans: this.props.listPlan,
      infoBankName: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onDropdownChange = this.onDropdownChange.bind(this);
    this.onPlanChange = this.onPlanChange.bind(this);
    this.submit = this.submit.bind(this);
    this.handleButtonView = this.handleButtonView.bind(this);
    this.onInfoClick = this.onInfoClick.bind(this);
  }

  onChange(e) {
    const newValue = cloneDeep(this.state);
    const { name, value } = e;
    newValue[name] = value;
    this.setState(newValue);
  }

  onDropdownChange(name, { value, label }) {
    const newValue = cloneDeep(this.state);
    newValue[name] = value;
    newValue.label = label;
    this.setState(newValue);
  }

  onPlanChange(plan) {
    this.setState({ plan });
  }

  onInfoClick(info) {
    const newValue = this.state;
    newValue[info] = !newValue[info];
    this.setState(newValue);
  }

  submit(e, type = 'next') {
    e.preventDefault();

    const { plan, label, bankName, bankNumber, bankAccount } = this.state;
    this.props.submit(
      {
        plan,
        bank: {
          label,
          bank_name: bankName,
          bank_number: bankNumber,
          bank_account: bankAccount,
        },
      },
      type
    );
  }

  handleButtonView(planName) {
    if (planName === this.state.plan) {
      return (
        <button disabled className="btn btn-primary btn-block m-t-20">
          <FormattedMessage id="shopping.currentPlan" />
        </button>
      );
    }

    return (
      <button
        className="btn btn-primary btn-block m-t-20"
        onClick={() => this.openModal(planName)}
      >
        <FormattedMessage id="shopping.upgrade" />
      </button>
    );
  }

  render() {
    const { isFetching } = this.props;
    return (
      <div className={styles['register__outer-container']}>
        <div className={styles['register__inner-container']}>
          <div className={styles.register__chatbot}>
            <form onSubmit={this.submit}>
              <div className={styles['shopping__plans-container']}>
                {this.state.plans.map(plan => (
                  <div
                    className={`${styles['shopping__plans-option']} ${
                      plan.id === this.state.plan
                        ? styles['shopping__plans-active']
                        : ''
                    }`}
                    key={plan.id}
                    onClick={() => this.onPlanChange(plan.id)}
                    role="none"
                  >
                    <div className="m-b-15">
                      <img
                        height="24"
                        src={`/img/icon/shopping/${plan.id}.png`}
                        alt=""
                        className="m-r-10"
                      />
                      <b>{plan.name}</b>
                    </div>

                    {plan.price !== 0 ? (
                      <h3 className="semi-bold">
                        IDR{' '}
                        <p className="display-inline bold fs-35">
                          {plan.price}
                        </p>
                        <FormattedMessage id="shopping.priceUnit" />
                      </h3>
                    ) : (
                      <h3
                        className={`semi-bold ${
                          styles.freePlan
                        } display-inline bold fs-35`}
                      >
                        Free
                      </h3>
                    )}

                    <hr />

                    <p className="text-sand">{plan.description}</p>
                    <div className={styles['shopping__plans-feature']}>
                      <ul>
                        {
                          plan.features.map( (feature, index) => feature && (<li key={`feature-${index}`}><i className="fa fa-check" /> {feature}</li>))
                        }
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              <div className="col-md-offset-3 col-md-6">
                <div
                  className={`form-group ${styles['form__group-register']} ${styles.label__info}`}
                >
                  <label htmlFor="bankName" className={styles.mb5}>
                    <FormattedMessage id="registerChannel.transactionData.bankName" />
                  </label>
                  <Dropdown
                    onChange={this.onDropdownChange}
                    options={configValues.BANK_DEFAULT}
                    className="m-b-10 select__register"
                    base={{
                      name: 'bankName',
                      required: false,
                      value: this.state.bankName,
                      isLoading: isFetching,
                    }}
                  />
                  <Tooltip 
                    position="right" 
                    text="registerChannel.info.bankName"
                    className={`${styles['label__info-icon']} ${this.state.infoBankName && styles['label__info-show']}`}
                    onClick={() => this.onInfoClick('infoBankName')}
                  >
                    <span className='fa fa-info' />
                  </Tooltip>
                </div>
                <Input
                  onChange={this.onChange}
                  label={formattedMessageHelper(
                    'registerChannel.transactionData.bankNumber'
                  )}
                  styles={`form-group ${styles['form__group-register']}`}
                  base={{
                    name: 'bankNumber',
                    disabled: isFetching,
                    value: this.state.bankNumber,
                  }}
                />

                <Input
                  onChange={this.onChange}
                  label={formattedMessageHelper(
                    'registerChannel.transactionData.bankAccount'
                  )}
                  styles={`form-group ${styles['form__group-register']}`}
                  base={{
                    name: 'bankAccount',
                    disabled: isFetching,
                    value: this.state.bankAccount,
                  }}
                />
                <div className="row">
                  <div className="col-sm-6">
                    <Button
                      className="btn btn-block btn-primary m-b-10"
                      isLoading={isFetching}
                      onClick={e => this.submit(e, 'prev')}
                    >
                      <i className="fa fa-angle-double-left m-r-10" />
                      <FormattedMessage id="registerChannel.prev" />
                    </Button>
                  </div>
                  <div className="col-sm-6">
                    <Button
                      className="btn btn-block btn-success"
                      isLoading={isFetching}
                    >
                      <FormattedMessage id="registerChannel.add" />
                      <i className="fa fa-plus-circle m-l-10 fs-14" />
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default TransactionData;

/* eslint-disable */
TransactionData.propTypes = {
  submit: PropTypes.func.isRequired,
  listPlan: PropTypes.array,
  isFetching: PropTypes.bool,
  channelData: PropTypes.any,
};
/* eslint-enable */

TransactionData.defaultProps = {
  isFetching: false,
  listPlan: [],
};
