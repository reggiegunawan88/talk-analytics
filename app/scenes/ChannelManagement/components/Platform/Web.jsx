import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Modal from 'react-responsive-modal';
import Switch from 'react-switch';

import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

import Button from 'shared_components/Button';
import Dropdown from 'shared_components/Dropdown';
import Input from 'shared_components/Input';
import { formattedMessageHelper, urlParams } from 'Modules/helper/utility';
import { botUrl } from '../../../../../config';

import styles from './styles.scss';

class Web extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
      payload: {
        color: 'black-mate',
        isPopup: 1,
        webhookURL: '',
      },
      themes: [
        { value: 'black-mate', label: 'Black-Mate' },
        { value: 'gida-green', label: 'Gida-Green' },
        { value: 'green', label: 'Green' },
        { value: 'white-orange', label: 'White-Orange' },
      ],
      copySuccess: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onDropdownChange = this.onDropdownChange.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.submit = this.submit.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
  }

  componentWillReceiveProps(props, prev) {
    if (props.data !== prev.data) this.setState({ payload: props.data });
  }

  onChange(e) {
    const newValue = cloneDeep(this.state);
    const { name, value } = e;
    newValue.payload[name] = value;
    this.setState(newValue);
  }

  onDropdownChange(name, { value }) {
    const { payload } = this.state;
    this.setState({ payload: { ...payload, [name]: value } });
  }

  togglePopup() {
    const { payload } = this.state;
    this.setState({ payload: { ...payload, isPopup: !payload.isPopup}});
  }

  async submit(e) {
    e.preventDefault();

    try {
      await this.props.update({ web: this.state.payload });
      this.props.onClose();
    } catch (err) {
      throw err;
    }
  }

  copyToClipboard() {
    document.getElementById('copyToClipboard').select();
    document.execCommand('copy');
    this.setState({ copySuccess: true });
    setTimeout(() => {
      this.setState({ copySuccess: false });
    }, 3000);
  }

  render() {
    const { isModalOpen, onClose, channelId } = this.props;
    const { isFetching } = this.state;
    const paramWeb = urlParams({ c: this.state.payload.color, popup: this.state.payload.isPopup ? 1 : 0 });
    const urlLivechat = `${botUrl}/user/${channelId + paramWeb}`;
    const scriptLivechat = `
<script>
  var talkabotlivechat = {
    url: ${urlLivechat}
  };
</script>
<script src="${botUrl}/public/livetalk/engine.js" />`
    return (
      <Modal
        classNames={{ modal: styles['platform-modal'] }}
        open={isModalOpen}
        onClose={onClose}
        center
      >
        <form onSubmit={this.submit}>
          <b>Link Form</b>
          <p className="fg-shade m-t-20">Web Account Data</p>
          <Dropdown
            onChange={this.onDropdownChange}
            label={formattedMessageHelper('platform.web.color')}
            options={this.state.themes}
            className="form-group m-b-10"
            base={{
              name: 'color',
              required: true,
              value: this.state.payload.color,
              isLoading: isFetching,
            }}
          />
          <div className='form-group'>
            <label htmlFor="Popup Status">
              <FormattedMessage id="platform.web.popup" />
            </label>
            <div className="m-b-5">
              <Switch onChange={this.togglePopup} checked={this.state.payload.isPopup} />
            </div>
          </div>
          <Input
            onChange={this.onChange}
            label={formattedMessageHelper('platform.web.webhook')}
            styles={`form-group-default ${styles['form-group--disabled']}`}
            base={{
              name: 'webhookURL',
              value: this.state.payload.webhookURL,
              disabled: true,
            }}
            required
          />
          <div className={styles['web-script']}>
            <label htmlFor="Add livechat script"><FormattedMessage id="platform.web.addScript" /></label>
            <textarea id="copyToClipboard" value={scriptLivechat} />
            <pre>{scriptLivechat}</pre>
            {this.state.copySuccess && (<div className={`text-red ${styles.copy__alert}`}><FormattedMessage id="platform.web.copyScript" /></div>)}
            <i className="fa fa-copy" onClick={this.copyToClipboard} role="none" />
          </div>

          <Button className="btn-primary btn-block m-t-20">
            <FormattedMessage id="profile.save" />
          </Button>
        </form>
      </Modal>
    );
  }
}

export default Web;

/* eslint-disable */
Web.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  update: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  data: PropTypes.any.isRequired,
  channelId: PropTypes.string.isRequired,
};
/* eslint-enable */

Web.defaultProps = {
  onClose: () => {},
};
