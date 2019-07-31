import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import Page from 'shared_components/Page';

class Analytics extends Component {
  render() {
    return (
      <Page>
        <div className="page__title">
          <h3><FormattedMessage id="navigation.analytics" /></h3>
        </div>
        <p>Coming Soon</p>
      </Page>
    );
  }
}

export default Analytics;
