import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Switch from 'react-switch';

import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

import { getIntegration, processIntegration } from 'Modules/integration';
import { configValues } from 'Config';
import styles from './styles.scss';
import Line from './Line';
import Web from './Web';
import Whatsapp from './Whatsapp';
import ModalNlp from './ModalNlp';
import Woocommerce from './Woocommerce';
import Telegram from './Telegram';
import getPlatformState from './selector';

const mapStateToProps = state => {
  const stateProps = getPlatformState(state);
  return stateProps;
};

const mapDispatchToProps = dispatch => {
  const dispatchFunc = bindActionCreators(
    { getIntegration, processIntegration },
    dispatch
  );
  return dispatchFunc;
};

class Platform extends Component {
  constructor(props) {
    super(props);

    this.state = {
      whichModalOpen: undefined,
      listintegration: {
        platforms: {
          line: {
            title: 'LINE',
            img: configValues.IMG.LINE_ICON_COLORED,
          },
          web: {
            title: 'Web Chat App',
            img: configValues.IMG.WC_ICON,
          },
          whatsapp: {
            title: 'Whatsapp',
            img: configValues.IMG.WHATSAPP_ICON,
          },
          telegram: {
            title: 'Telegram',
            img: configValues.IMG.TELEGRAM_ICON,
          },
        },
        listnlp: {
          nlp: {
            title: 'NLP',
            img: '',
          },
        },
        listinventory: {
          woocommerce: {
            title: 'Woocommerce',
            img: configValues.IMG.WOO_ICON,
          },
        },
      }
    };

    this.closeModal = this.closeModal.bind(this);
    this.toggleIntegration = this.toggleIntegration.bind(this);
  }

  componentDidMount() {
    this.props.getIntegration();
  }

  openModal(platform) {
    this.setState({ whichModalOpen: platform });
  }

  closeModal() {
    this.setState({ whichModalOpen: undefined });
  }

  toggleIntegration(p) {
    const platform = cloneDeep({ [p]: this.props[p] });
    platform[p].isIntegrated = !platform[p].isIntegrated;

    this.props.processIntegration(platform);
  }

  render() {
    return (
      <div> 
        {Object.keys(this.state.listintegration).map((g,index) => {
          if (this.props.pages.includes(g)) {
            return (
              <div key={index} className="panel panel-transparent">
                <div className="panel-body padding-0 m-t-30">
                  <b className="display-inline-block m-t-10 fs-16">
                    <FormattedMessage id={`channelManagement.integration.${g}`} />
                  </b>
                </div>
                <table className={`table ${styles.table__platform}`}>
                  <tbody>
                    {Object.keys(this.state.listintegration[g]).map(p => (
                      <tr key={p}>
                        <td className={styles["w-100px"]}>
                          <Switch
                            onChange={() => this.toggleIntegration(p)}
                            checked={this.props[p] && this.props[p].isIntegrated ? this.props[p].isIntegrated : false }
                          />
                        </td>
                        <td>
                          {this.state.listintegration[g][p].img && (<img width="25" className="m-r-5" src={this.state.listintegration[g][p].img} alt=""/>
                          )}
                          {this.state.listintegration[g][p].title}
                        </td>
                        <td className={styles["w-100px"]}>
                          <button
                            className="btn btn-sm btn-ghost"
                            onClick={() => this.openModal(p)}
                          >
                            Config
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        })} 
        <Line
          data={this.props.line}
          isModalOpen={this.state.whichModalOpen === 'line'}
          update={this.props.processIntegration}
          onClose={this.closeModal}
        />
        <Web
          data={this.props.web}
          isModalOpen={this.state.whichModalOpen === 'web'}
          update={this.props.processIntegration}
          channelId={this.props.channelId}
          onClose={this.closeModal}
        />
        <Whatsapp
          data={this.props.whatsapp}
          isModalOpen={this.state.whichModalOpen === 'whatsapp'}
          update={this.props.processIntegration}
          onClose={this.closeModal}
        />
        <Telegram
          data={this.props.telegram}
          isModalOpen={this.state.whichModalOpen === 'telegram'}
          update={this.props.processIntegration}
          onClose={this.closeModal}
        />
        {this.props.pages.includes("listnlp") && (
          <ModalNlp
            data={this.props.nlp}
            isModalOpen={this.state.whichModalOpen === 'nlp'}
            update={this.props.processIntegration}
            onClose={this.closeModal}
          />
        )}
        {this.props.pages.includes("listinventory") && (
          <Woocommerce
            data={this.props.woocommerce}
            isModalOpen={this.state.whichModalOpen === 'woocommerce'}
            update={this.props.processIntegration}
            onClose={this.closeModal}
          />
        )}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Platform);

/* eslint-disable */
Platform.propTypes = {
  getIntegration: PropTypes.func.isRequired,
  processIntegration: PropTypes.func.isRequired,
  line: PropTypes.any,
  web: PropTypes.any,
  whatsapp: PropTypes.any,
  telegram: PropTypes.any,
  nlp: PropTypes.any,
  woocommerce: PropTypes.any,
  pages: PropTypes.array,
  channelId: PropTypes.string.isRequired,
};
/* eslint-enable */

Platform.defaultProps = {
  line: {},
  web: {},
  whatsapp: {},
  telegram: {},
  nlp: {},
  woocommerce: {},
  pages: [],
};
