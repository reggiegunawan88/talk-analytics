import React, { Component } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';

import { configValues as config } from 'Config';
import Page from 'shared_components/Page';
import PageLoader from 'shared_components/PageLoader';
import { getFeedback } from 'Modules/feedback';
import getFeedbackState from './selector';
import styles from './styles.scss';

const mapStateToProps = state => {
  const stateProps = getFeedbackState(state);
  return stateProps;
}

const platformImage = {
  line: `<img alt="" src=${config.IMG.LINE_ICON} />`,
  web: '<i class="fa fa-globe" />',
  whatsapp: '<i class="fa fa-whatsapp" />'
}
class Feedback extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pagination: {
        page: 1,
        size: 20,
      }
    }

    this.renderProfileImage = this.renderProfileImage.bind(this);
    this.fetchNextPage = this.fetchNextPage.bind(this);
  }

  componentDidMount(){
    this.props.getFeedback(this.state.pagination);
  }

  fetchNextPage() {
    const { hasMoreData } = this.props;

    setTimeout(() => {
      if (hasMoreData) {
        const newVal = this.state;
        newVal.pagination.page += 1;

        this.setState(newVal);
        this.props.getFeedback(this.state.pagination);
      }
    }, 500);
  }

  renderProfileImage(name) {
    const [firstName, ...lastName] = name.split(' ');
    const [firstNameInitial] = firstName;

    if (lastName.length > 0) {
      const [lastNameInitial] = lastName[lastName.length - 1];
      return (
        <div>
          {firstNameInitial ? firstNameInitial.toUpperCase() : null}
          {lastNameInitial ? lastNameInitial.toUpperCase() : null}
        </div>
      );
    }

    return <div>{firstNameInitial.toUpperCase()}</div>;
  }

  render() {
    const { feedbackSortDate, hasMoreData } = this.props;
    let feedbacks = this.props.feedbacks;
    feedbacks = orderBy(feedbacks,'createdat','desc');
    return (
      <Page>
        <div className="page__title">
          <h3><FormattedMessage id="navigation.feedback" /></h3>
        </div>
        <div className={styles.feedback}>
          <InfiniteScroll
            dataLength={feedbacks.length}
            next={this.fetchNextPage}
            hasMore={hasMoreData}
            loader={<PageLoader className="full-width padding-10" />}
          >
          {feedbackSortDate.map(date => (
            <div key={date} className={styles.feedback__date}>
              <span>
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <ul className={styles.feedback__list}>
                {feedbacks.map((data,index) => {
                  if (data.createdat.split('T')[0] === date) {
                    return (
                      <li key={index}>
                        <div className={styles['feedback__list-icon']} dangerouslySetInnerHTML={{ __html: platformImage[data.platform]}} />
                        <div className={styles['feedback__list-profil']}>
                          {this.renderProfileImage(data.name)}
                        </div>
                        <div className={styles['feedback__list-info']}>
                          <h6>{data.name}</h6>
                          <p>{data.message ? data.message : '-'}</p>
                        </div>
                      </li>
                    );
                  }
                })}
              </ul>
            </div>
          ))}
          </InfiniteScroll>
        </div>
      </Page>
    );
  }
}

export default connect(mapStateToProps, { getFeedback })(Feedback);

/* eslint-disable */
Feedback.propTypes = {
  getFeedback: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  hasMoreData: PropTypes.bool.isRequired,
  feedbackSortDate: PropTypes.array,
  feedbacks: PropTypes.array,
};
/* eslint-enable */

Feedback.defaultProps = {
  feedbackSortDate: [],
  feedbacks: [],
};
