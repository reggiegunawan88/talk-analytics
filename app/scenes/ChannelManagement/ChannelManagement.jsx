import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import Page from 'shared_components/Page';
import { getAllAgent, addNewAgent, updateAgent } from 'Modules/profile';
import Channel from './components/Channel';
import AgentAdmin from './components/AgentAdmin';
import Platform from './components/Platform';
import styles from './styles.scss';
import getChannelState from './selector';

const mapStateToProps = state => {
  const stateProps = getChannelState(state);
  return stateProps;
};

const mapDispatchToProps = dispatch => {
  const dispatchFunc = bindActionCreators(
    {
      getAllAgent,
      addNewAgent,
      updateAgent,
    },
    dispatch
  );
  return dispatchFunc;
};

class ChannelManagement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'channel',
      tabs: ['channel', 'agentAdmin', 'integration'],
    };

    this.renderActiveTabContent = this.renderActiveTabContent.bind(this);
    this.changeActiveTab = this.changeActiveTab.bind(this);

    this.createNewAgent = this.createNewAgent.bind(this);
    this.editAgent = this.editAgent.bind(this);
  }

  componentDidMount() {
    this.props.getAllAgent(this.props.bot.id);
  }

  changeActiveTab(tab) {
    this.setState({ activeTab: tab });
  }

  createNewAgent(agentData) {
    const completeAgentData = {
      ...agentData,
      channelId: [this.props.bot.id],
    };

    this.props.addNewAgent(completeAgentData);
  }

  editAgent(agentData) {
    this.props.updateAgent(agentData);
  }

  // deleteAgent(agentData) {

  // }

  renderActiveTabContent() {
    const { activeTab } = this.state;

    const tab = {
      channel: (
        <Channel bot={this.props.bot} isFetching={this.props.isFetching} />
      ),
      agentAdmin: (
        <AgentAdmin
          createNewAgent={this.createNewAgent}
          editAgent={this.editAgent}
          agentList={this.props.agentList}
          channelActive={this.props.bot}
          isFetching={this.props.isFetching}
        />
      ),
      integration: <Platform pages={this.props.pages} channelId={this.props.bot.id} />,
    };

    return tab[activeTab];
  }

  render() {
    return (
      <Page>
        <div className="panel panel-default m-t-30">
          <div className="panel-body padding-20">
            <ul
              className={`nav nav-tabs nav-tabs-simple ${
                styles['c-bot-management__tab']
                }`}
            >
              {this.state.tabs.map(tab => {
                if (this.props.pages.includes(tab)) {
                  return (
                    <li
                      role="none"
                      className={`nav-item ${
                        this.state.activeTab === tab ? `active ${styles.active}` : ''
                        }`}
                      key={`${tab}-tab`}
                      onClick={() => this.changeActiveTab(tab)}
                    >
                      <a>
                        <FormattedMessage id={`channelManagement.tab.${tab}`} />
                      </a>
                    </li>
                  )
                }
              })}
            </ul>
            {this.renderActiveTabContent()}
          </div>
        </div>
      </Page>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelManagement);

/* eslint-disable */
ChannelManagement.propTypes = {
  bot: PropTypes.any,
  isFetching: PropTypes.bool.isRequired,
  agentList: PropTypes.array,
  getAllAgent: PropTypes.func,
  updateAgent: PropTypes.func,
  addNewAgent: PropTypes.func,
  pages: PropTypes.array,
};
/* eslint-enable */

ChannelManagement.defaultProps = {
  bot: {},
  agentList: [],
  pages: [],
};
