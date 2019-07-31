import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import map from 'lodash/map';
import capitalize from 'lodash/capitalize';

import PageLoader from 'shared_components/PageLoader';
import Chat from '../Chat';
import styles from './style.scss';

class ChatList extends Component {
  constructor(props) {
    super(props);

    const tabFirst = this.props.activeChannel.inactive ? "unassign" : "bot";
    const tabSecond = this.props.activeChannel.inactive ? "me" : "human";
    
    this.state = {
      highlighted: null,
      paralax: false,
      newChatlist: {},
      isFilterOpen: '',
      tabFirst: capitalize(tabFirst),
      tabFirstValue: tabFirst,
      tabSecond: capitalize(tabSecond),
      tabSecondValue: "me",
    };

    this.fetchMoreChats = this.fetchMoreChats.bind(this);
    this.selectChat = this.selectChat.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.updateAgent = this.updateAgent.bind(this);
    this.toggleFilterDropdown = this.toggleFilterDropdown.bind(this);
    this.renderListChat = this.renderListChat.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { platform: prevPlatform } = prevProps;
    const { platform } = this.props;

    if (prevPlatform !== platform) {
      this.props.fetchConversations(1, 20, this.props.conversationSorting);
    }

    if (prevProps.activeChannel.inactive !== this.props.activeChannel.inactive) {
      const tabFirst = this.props.activeChannel.inactive ? "unassign" : "bot";
      const tabSecond = this.props.activeChannel.inactive ? "me" : "human";

      this.setState({
        tabFirst: capitalize(tabFirst),
        tabFirstValue: tabFirst,
        tabSecond: capitalize(tabSecond),
        tabSecondValue: "me",
      });
    }
  }

  async loadChat() {
    if (this.state.highlighted) {
      try {
        await this.props.fetchChat(this.state.highlighted);
      } catch (e) {
        console.log(e);
      }
    }
  }

  toggleFilterDropdown() {
    const { isFilterOpen } = this.state;

    if (isFilterOpen === '') {
      this.setState({ isFilterOpen: 'active' });
    } else {
      this.setState({ isFilterOpen: '' });
    }
  }

  updateFilter(e) {
    const {
      currentTarget: { name },
    } = e;

    this.props.filterChange(name);
  }

  updateAgent(e) {
    const {
      currentTarget: {
        dataset: { agentType },
      },
    } = e;

    if (agentType !== this.props.activeAgent) this.props.agentChange(agentType);
  }

  selectChat(user) {
    this.setState({ highlighted: user });
    this.props.fetchChat(user);
    this.showChatDetails();
  }

  showChatDetails() {
    if (window.innerWidth < 980) {
      this.setState({ paralax: true });
    }
  }

  sortByDate(arr) {
    return arr.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  fetchMoreChats() {
    const { fetchConversations, conversationPage } = this.props;

    fetchConversations(
      conversationPage + 1,
      20,
      this.props.conversationSorting
    );
  }

  renderListChat(){
    const { list, shownChat, hasMore, isFetchingUnread } = this.props;
    const { newChatlist } = this.state;
    
    return(
      <InfiniteScroll
        dataLength={shownChat}
        next={this.fetchMoreChats}
        hasMore={hasMore}
        loader={<PageLoader className="full-width padding-10" />}
        scrollableTarget="scrollableDiv"
      >
        <div
          data-init-list-view="ioslist"
          className="list-view boreded no-top-border"
        >
        {Object.keys(list)
          .sort()
          .reverse()
          .map((date, index) => {
            let isNewDate = true;
            Object.keys(newChatlist)
              .sort()
              .reverse()
              .map(newDate => {
                if (newDate === date) {
                  isNewDate = false;
                }
              });
            return (
              isNewDate && (
                <div
                  key={index}
                  className="list-view-group-container"
                >
                  <div className="list-view-group-header text-uppercase">
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <ul>
                    {map(
                      this.sortByDate(list[date]),
                      (conversation, cIndex) => {
                        let isSame = false;
                        if (Object.keys(newChatlist).length > 0) {
                          Object.keys(newChatlist).map(chatDate => {
                            map(
                              newChatlist[chatDate],
                              incomingChat => {
                                if (
                                  incomingChat.customerId ===
                                  conversation.customerId
                                ) {
                                  isSame = true;
                                }
                              }
                            );
                          });
                        }

                        return (
                          !isSame && (
                            <Chat
                              key={cIndex}
                              biodata={conversation.biodata}
                              name={conversation.name}
                              platform={conversation.platform}
                              lastLog={conversation.lastLog}
                              timestamp={conversation.updatedAt}
                              user={conversation}
                              setUnread={this.props.setUnread}
                              isFetchingUnread={isFetchingUnread}
                              onClick={this.selectChat}
                              isActive={
                                conversation.id ===
                                (this.state.highlighted
                                  ? this.state.highlighted.id
                                  : null)
                              }
                            />
                          )
                        );
                      }
                    )}
                  </ul>
                </div>
              )
            );
          })
        }
        </div>
      </InfiniteScroll>
    );
  }

  render() {
    const {
      list,
      activeAgent,
      activeChat,
    } = this.props;
    const { tabFirst, tabFirstValue, tabSecond, tabSecondValue } = this.state;

    return (
      <div
        className={`${styles['adjusted-dimension']} ${
          activeChat ? styles.hidden : ''
        }  split-list chat-list`}
      >
        <div className={`chatlist ${styles['adjusted-chatlist']}`}>
          <div className={`view-port clearfix`} id="chat">
            {/* BEGIN View Header ! */}
            <div className={`navbar ${styles['adjusted-navbar']}`}>
              <div className="navbar-inner">
                <div className={`view-heading ${styles['adjusted-font-size']}`}>
                  Chats
                </div>
              </div>
            </div>
            {/* BEGIN Human/Bot Switch Header */}
            
            <div className={`${styles['bot-human-switch']}`}>
              <button
                onClick={this.updateAgent}
                data-agent-type="all"
                className={`${styles.switch} ${
                  activeAgent === 'all' ? styles.active : ''
                }`}
              > 
                All
              </button>
              <button
                onClick={this.updateAgent}
                data-agent-type={tabFirstValue}
                className={`${styles.switch} ${
                  activeAgent === tabFirstValue ? styles.active : ''
                }`}
              >
                {tabFirst}
              </button>
              <button
                onClick={this.updateAgent}
                data-agent-type={tabSecondValue}
                className={`${styles.switch} ${
                  activeAgent === tabSecondValue ? styles.active : ''
                }`}
              >
                {tabSecond}
              </button>
            </div>
            {/* END View Header ! */}
            <div
              id="scrollableDiv"
              className={`view bg-white ${styles['adjusted-chatlist-scroll']}`}
            >
              {/* END Human/Bot Switch Header */}
              
                  {Object.keys(list).length > 0 ? this.renderListChat() : <p className={styles.nodata}><FormattedMessage id="chatroom.noData"/></p>}
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>
    );
  }
}

export default ChatList;

/* eslint-disable */
ChatList.propTypes = {
  platform: PropTypes.any,
  activeAgent: PropTypes.any,
  fetchConversations: PropTypes.func.isRequired,
  conversationSorting: PropTypes.any,
  fetchChat: PropTypes.func.isRequired,
  filterChange: PropTypes.func.isRequired,
  fetchMoreChats: PropTypes.func,
  hasMore: PropTypes.bool,
  shownChat: PropTypes.number.isRequired,
  activeChannel: PropTypes.any,
  activeChat: PropTypes.any,
  agentChange: PropTypes.func.isRequired,
  conversationPage: PropTypes.number,
  list: PropTypes.any,
  isFetchingUnread: PropTypes.bool.isRequired,
  setUnread: PropTypes.func.isRequired,
};
/* eslint-enable */

ChatList.defaultProps = {
  platform: {},
  activeAgent: {},
  conversationSorting: {},
  activeChannel: {},
  activeChat: {},
  list: {},
  hasMore: false,
  conversationPage: 1
};
