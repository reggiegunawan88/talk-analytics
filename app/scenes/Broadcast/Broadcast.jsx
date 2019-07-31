import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import cloneDeep from 'lodash/cloneDeep';
import PropTypes from 'prop-types';

import { formattedMessageHelper } from 'Modules/helper/utility';
import { configValues } from 'Config';
import Page from 'shared_components/Page';
import Input from 'shared_components/Input';
import Button from 'shared_components/Button';
import Dropdown from 'shared_components/Dropdown';
import Radio from 'shared_components/Radio';
import styles from './styles.scss';
import getBroadcastState from './selector';
import { sendBroadcast } from 'Modules/broadcast';

const mapStateToProps = state => {
  const stateProps = getBroadcastState(state);
  return stateProps;
};

class Broadcast extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loyaltyTarget: 'choose',
      whichModalOpen: undefined,
      broadcastDetail: {
        platform: 'all',
      },
      typeList: [
        { label: 'QNA', value: 'qna' },
        { label: 'News', value: 'news' },
        { label: 'Promo', value: 'promo' },
      ],
      dateRadio: [
        { label: formattedMessageHelper('broadcast.sendNow'), value: '1' },
      ],
      platFormList: [
        {
          label: formattedMessageHelper('broadcast.allPlatform'),
          value: 'all',
        },
        {
          label: formattedMessageHelper('broadcast.facebook'),
          img: configValues.IMG.FB_ICON,
          value: 'facebook',
        },
        {
          label: formattedMessageHelper('broadcast.line'),
          img: configValues.IMG.LINE_ICON_COLORED,
          value: 'line',
        },
        {
          label: formattedMessageHelper('broadcast.webchat'),
          img: configValues.IMG.WC_ICON,
          value: 'webchat',
        },
      ],
      getLoyalty: [
        {
          name: 'All Target',
          value: 'all',
          checked: true,
          notif: 'All loyalty target with all points and spending',
          color: '',
          low: '',
          high: '',
        },
        {
          name: 'Silver',
          value: 'silver',
          checked: true,
          notif: '',
          color: '#a9c4c8',
          low: 67,
          high: 77,
        },
        {
          name: 'GOLD',
          value: 'gold',
          checked: true,
          notif: '',
          color: '#b5b95a',
          low: 107,
          high: 177,
        },
        {
          name: 'BRONZE',
          value: 'bronze',
          checked: true,
          notif: '',
          color: '#b9874d',
          low: 37,
          high: 67,
        },
      ],
    };

    this.onDropdownChange = this.onDropdownChange.bind(this);
    this.onRadioChange = this.onRadioChange.bind(this);
    this.onChangeMessage = this.onChangeMessage.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.submit = this.submit.bind(this);
  }

  onDropdownChange(name, { value, label }) {
    const newValue = cloneDeep(this.state);
    newValue.broadcastDetail[name] = value;
    this.setState(newValue);
  }

  onRadioChange(name, value) {
    const newValue = cloneDeep(this.state);
    newValue.broadcastDetail[name] = value;
    this.setState(newValue);
  }

  onChangeMessage(e) {
    const newValue = cloneDeep(this.state);
    let { name, value } = e;
    newValue.broadcastDetail[name] = value;
    this.setState(newValue);
  }

  openModal(typeModal) {
    this.setState({ whichModalOpen: typeModal });
  }

  closeModal() {
    this.setState({ whichModalOpen: undefined });
  }

  submit(e) {
    e.preventDefault();
    this.props.sendBroadcast(this.state.broadcastDetail).then(() => {
      this.setState({
        broadcastDetail: {
          date: new Date(),
          platform: 'all',
        },
      });
    });
  }

  render() {
    const { isFetching } = this.props;
    return (
      <Page>
        <div className="page__title">
          <h3><FormattedMessage id="broadcast.titlePage" /></h3>
          <p>
            <FormattedMessage id="broadcast.pageInfo" />
          </p>
        </div>
        <form
          className="form-horizontal text-left m-t-20"
          onSubmit={this.submit}
        >
          <div className="form-group no-margin p-t-40 p-b-40">
            <div
              className={`col-md-3 p-l-30 p-r-30 fs-14 ${styles['f-w-600']}`}
            >
              <FormattedMessage id="broadcast.broadcastType" />
            </div>
            <div className="col-md-8 pull-right">
              <div className="row">
                <div className="col-md-3 p-l-15 p-r-15">
                  <Dropdown
                    onChange={this.onDropdownChange}
                    options={this.state.typeList}
                    base={{
                      name: 'type',
                      required: false,
                      value: this.state.broadcastDetail.type || '',
                    }}
                  />
                </div>
                <div className="col-md-9 p-l-15 p-r-15">
                  <p className="text-primary">
                    <FormattedMessage id="broadcast.broadcastTypeInfo" />
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="form-group no-margin p-t-40 p-b-40">
            <div
              className={`col-md-3 p-l-30 p-r-30 fs-14 ${styles['f-w-600']}`}
            >
              <FormattedMessage id="broadcast.dateTime" />
            </div>
            <div className="col-md-8 pull-right">
              <div className="row">
                <div className="col-md-3 p-l-15 p-r-15">
                  <Radio
                    value="1"
                    data={this.state.dateRadio}
                    base={{
                      name: 'date',
                    }}
                  />
                </div>
                <div className="col-md-9 p-l-15 p-r-15">
                  <p className={styles['text-disable']}>
                    <FormattedMessage id="broadcast.dateTimeInfo" />
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="form-group no-margin p-t-40 p-b-40">
            <div
              className={`col-md-3 p-l-30 p-r-30 fs-14 ${styles['f-w-600']}`}
            >
              <FormattedMessage id="broadcast.platform" />
            </div>
            <div
              className={`col-md-8 p-l-30 p-r-30 pull-right ${
                styles['platform-radio']
              }`}
            >
              <Radio
                onChange={this.onRadioChange}
                value={this.state.broadcastDetail.platform}
                data={this.state.platFormList}
                base={{
                  name: 'platform',
                }}
              />
            </div>
          </div>
          <div className="form-group no-margin p-t-40 p-b-40">
            <div
              className={`col-md-3 p-l-30 p-r-30 fs-14 ${styles['f-w-600']}`}
            >
              <FormattedMessage id="broadcast.loyaltyTarget" />
            </div>
            <div className="col-md-8 pull-right">
              <div className="row">
                <div className="col-md-3 p-l-15 p-r-15">
                  <Button
                    type="button"
                    className="btn-default btn-block"
                    isLoading={true}
                  >
                    <FormattedMessage id="broadcast.choose" />
                  </Button>
                </div>
                <div className="col-md-9 p-l-15 p-r-15">
                  <p className="text-primary">
                    <FormattedMessage id="broadcast.loyaltyTargetInfo" />
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`form-group no-margin p-t-40 p-b-40 ${
              styles['no-border']
            }`}
          >
            <div
              className={`col-md-3 p-l-30 p-r-30 fs-14 ${styles['f-w-600']}`}
            >
              <FormattedMessage id="broadcast.message" />
            </div>
            <div className={`col-md-9 pull-right ${styles['textarea-200']}`}>
              <Input
                textarea={true}
                onChange={this.onChangeMessage}
                withLabel={false}
                base={{
                  name: 'message',
                  value: this.state.broadcastDetail.message || '',
                  disabled: false,
                }}
                required
              />
            </div>
          </div>
          <div className="clearfix" />

          <div className="no-margin p-t-10 p-b-40">
            <Button isLoading={isFetching} className="pull-right btn-primary">
              <FormattedMessage id="broadcast.send" />
            </Button>
          </div>
        </form>
      </Page>
    );
  }
}

export default connect(
  mapStateToProps,
  { sendBroadcast }
)(Broadcast);

/* eslint-disable */
Broadcast.propTypes = {
  sendBroadcast: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
};
/* eslint-enable */
