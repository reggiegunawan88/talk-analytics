import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';

import 'babel-polyfill';

import routes from './routes';
import store from './store';

import '../assets/plugins/pace/pace-theme-flash.css';
import '../assets/plugins/boostrapv3/css/bootstrap.min.css';
import '../assets/plugins/bootstrap-tag/bootstrap-tagsinput.css';
import '../assets/plugins/jquery-datatable/media/css/dataTables.bootstrap.css';
import '../assets/plugins/switchery/css/switchery.css';
import '../pages/css/pages.min.css';
import '../assets/css/custom.css';

function initialize() {
  const Root = () => <Provider store={store}>{routes}</Provider>;

  render(<Root />, document.getElementById('root'));
}

document.addEventListener('DOMContentLoaded', initialize);
