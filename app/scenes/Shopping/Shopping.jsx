import React, { Component } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import { getPlan } from 'Modules/plan';
import { updatePlan } from 'Modules/auth';
import { checkUpgrade, upgradePlan } from 'Modules/payment';
import Page from 'shared_components/Page';
import PageLoader from 'shared_components/PageLoader';
import PlanList from './PlanList';
import Payment from './Payment';
import Invoice from './Invoice';
import getShoppingState from './selector';

const mapStateToProps = state => {
  const stateProps = getShoppingState(state);
  return stateProps;
};

const mapDispatchToProps = dispatch => {
  const dispatchFunc = bindActionCreators({ updatePlan, getPlan, checkUpgrade, upgradePlan }, dispatch);
  return dispatchFunc;
};

class Shopping extends Component {
  constructor(props) {
    super(props);

    this.state = {
      planChoose: "",
      paymentStep: "plan",
      showFeatures: false,
    };

    this.onUpgrade = this.onUpgrade.bind(this);
    this.paymentFinish = this.paymentFinish.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  componentDidMount() { 
    this.props.checkUpgrade();

    this.props.getPlan();
  }

  onUpgrade(plan) {
    this.setState({ planChoose: plan, paymentStep: "payment" });
  }

  goBack(step) {
    this.setState({ paymentStep: step });
  }

  paymentFinish() {
    const planChoosen = this.props.plans.find((p) => p.id === this.state.planChoose);
    const payload = {
      channelId: this.props.channelId,
      plan: this.state.planChoose,
      amount: planChoosen.priceComplete,
      email: this.props.channelEmail,
    };
    this.props.upgradePlan(payload).then(() => {
      this.setState({ paymentStep: "invoice" })
    } );
  }

  render() {
    const paymentStep = !this.props.payment.statusUpgrade ? 'invoice' : this.state.paymentStep;

    let dataInvoice = this.props.payment.listInvoice[0];
    if (!this.props.payment.statusUpgrade) {
      dataInvoice = this.props.payment.listInvoice;
    }

    const component = {
      plan: (<PlanList plans={this.props.plans} planChoose={this.state.planChoose} onUpgrade={this.onUpgrade} />),
      payment: (<Payment plan={this.props.plans.find((p) => p.id === this.state.planChoose)} onClick={this.paymentFinish} goBack={this.goBack}/>),
      invoice: (<Invoice plans={this.props.plans} channelName={this.props.channelName} invoiceData={dataInvoice} statusUpgrade={this.props.payment.statusUpgrade}/>),
    }
    return (
      <Page>
        <div className="m-t-30">
          {this.props.payment.isFetching ? (<PageLoader className="full-width padding-10" />) : component[paymentStep]}
        </div>
      </Page>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Shopping);

/* eslint-disable */
Shopping.propTypes = {
  plan: PropTypes.any,
  updatePlan: PropTypes.func.isRequired,
  getPlan: PropTypes.func.isRequired,
  checkUpgrade: PropTypes.func.isRequired,
  upgradePlan: PropTypes.func.isRequired,
  payment: PropTypes.any,
  plans: PropTypes.array,
  channelId: PropTypes.string,
  channelName: PropTypes.string,
  channelEmail: PropTypes.string,
};
/* eslint-enable */

Shopping.defaultProps = {
  plans: [],
  payment: {},
  plan: 'personal',
  channelId: '',
  channelName: '',
  channelEmail: '',
};
