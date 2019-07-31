import React, { Component } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import PageLoader from 'shared_components/PageLoader';
import { getPlan } from 'Modules/plan';
import Stepper from 'shared_components/Stepper';
import { getTemplates } from 'Modules/bottemplate';
import ChatbotData from './ChatbotData';
import CompanyData from './CompanyData';
import Payment from '../../../Shopping/Payment';
import Invoice from '../../../Shopping/Invoice';
import TransactionData from './TransactionData';
import getChannelFormState from './selector';
import styles from './styles.scss';

const mapStateToProps = state => {
  const stateProps = getChannelFormState(state);
  return stateProps;
};

class ChannelForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      channelData: null,
      activeStep: 0,
      skipStep: [],
      step: ['Chatbot Data', 'Company Data', 'Transaction Data'],
      listPlan: [], 
      pagination: {
        page: 1,
        size: 20,
      }
    };

    this.submit = this.submit.bind(this);
    this.handleStep = this.handleStep.bind(this);
    this.loadMoreTemplate = this.loadMoreTemplate.bind(this);
    this.paymentFinish = this.paymentFinish.bind(this);
  }

  componentDidMount() {
    this.props.getPlan().then(() => {
      this.setState({ listPlan: this.props.plans });
    });
    
    this.props.getTemplates(this.state.pagination);
  }

  loadMoreTemplate() {
    const { hasMoreData } = this.props;

    setTimeout(() => {
      if (hasMoreData) {
        const newVal = this.state;
        newVal.pagination.page = this.state.pagination.page + 1;

        this.setState(newVal);
        this.props.getTemplates(newVal.pagination);
      }
    }, 500);
  }

  submit(e, type = 'next') {
    const { activeStep, channelData } = this.state;
    let setStep = activeStep + 1;
    if (type === 'prev') {
      setStep = activeStep - 1;
    }

    this.setState({
      channelData: { ...channelData, ...e },
      activeStep: setStep,
    });
  }

  async paymentFinish () {
    const { channelData } = this.state;

    await this.props.submit({ ...channelData });
    this.submit(channelData);
  }

  handleStep() {
    const { isFetchingRegister, provinces, cities, subDistricts, isFetchingTemplate, listBotTemplate } = this.props;
    const { activeStep, channelData, listPlan } = this.state;
    const propStep = {
      isFetching: isFetchingRegister,
      submit: (e, type) => this.submit(e, type),
      channelData,
    };

    const stepShow = [
      <ChatbotData {...propStep} templateFetch={isFetchingTemplate} hasMoreData={this.props.hasMoreData} botTemplate={listBotTemplate} loadTemplate={this.loadMoreTemplate} />,
      <CompanyData {...propStep} provinces={provinces} cities={cities} subDistricts={subDistricts} userEmail={this.props.emailUser}/>,
      <TransactionData {...propStep} listPlan={listPlan}/>,
      <Payment plan={channelData && this.state.listPlan.find((p) => p.id === channelData.plan)} onClick={this.paymentFinish} goBack={() => this.submit(channelData, 'prev')} className={styles["payment--container"]} />,
      <Invoice plans={this.state.listPlan} channelName={this.state.channelData && this.state.channelData.name} invoiceData={this.props.payment.listInvoice[0]} statusUpgrade className={styles["payment--container"]} />,
    ];

    return isFetchingRegister ? <PageLoader className="full-width padding-10" /> : stepShow[activeStep];
  }

  render() {
    const { activeStep, step } = this.state;
    return (
      <div className={styles.channel}>
        {activeStep < step.length && (
          <Stepper
            listStep={this.state.step}
            activeStep={this.state.activeStep}
            skipStep={this.state.skipStep}
          />
        )}

        {this.handleStep()}

      </div>
    );
  }
}

export default connect(mapStateToProps, { getPlan, getTemplates })(ChannelForm);

/* eslint-disable */
ChannelForm.propTypes = {
  submit: PropTypes.func.isRequired,
  getPlan: PropTypes.func.isRequired,
  isFetchingRegister: PropTypes.bool.isRequired,
  isFetchingTemplate: PropTypes.bool.isRequired,
  hasMoreData: PropTypes.bool.isRequired,
  emailUser: PropTypes.string,
  provinces: PropTypes.array,
  cities: PropTypes.array,
  subDistricts: PropTypes.array,
  plans: PropTypes.array,
  payment: PropTypes.any,
  listBotTemplate: PropTypes.array,
  getTemplates: PropTypes.func,
};
/* eslint-enable */

ChannelForm.defaultProps = {
  provinces: [],
  cities: [],
  subDistricts: [],
  plans: [],
  payment: {},
  emailUser: '',
  getTemplates: () => {},
  listBotTemplate: [],
};
