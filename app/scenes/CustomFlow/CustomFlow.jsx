import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import Page from 'shared_components/Page';
import { flowUrl } from '../../../config';
import getCustomFlowState from './selector';
import styles from './styles.scss';

const mapStateToProps = state => {
  const stateProps = getCustomFlowState(state);
  return stateProps;
};

class CustomFlow extends PureComponent {
  render() {
    return (
      <Page showBreadcrumb={false} isFluid={false}>
        <iframe
          scrolling="yes"
          className={styles['c-custom-flow__iframe']}
          src={`${flowUrl}${this.props.activeChannel && this.props.activeChannel.id}`}
        />
      </Page>
    );
  }
}

export default connect(mapStateToProps)(CustomFlow);

/* eslint-disable */
CustomFlow.propTypes = {
  activeChannel: PropTypes.any.isRequired,
};
/* eslint-enable */

CustomFlow.defaultProps = {
  activeChannel: {},
};
