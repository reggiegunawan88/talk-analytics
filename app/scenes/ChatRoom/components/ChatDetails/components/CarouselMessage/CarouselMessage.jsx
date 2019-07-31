import React from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import map from 'lodash/map';

import { removeHtmlTag } from 'Modules/helper/utility';
import configValues from 'Config/configValues';
import styles from '../../style.scss';

const CarouselMessage = ({ responses }) => (
      <div className="message clearfix">
        <div className={`chat-bubble from-me ${styles['adjusted-from-me']} ${styles.chat__carousel}`}>
          <div>
            {map(responses, (response, index) => (
              <div key={index} className={styles['chat__carousel-box']}>
                <div className={styles['chat__carousel-image']}>
                  <img src={response.image ? response.image : configValues.IMG.LOGO_NO_IMAGE} alt={response.title} />
                </div>
                <div className={styles['chat__carousel-info']}>
                  <h3>{response.title}</h3>
                  <p>{removeHtmlTag(response.description)}</p>
                </div>
                <div className={styles['chat__carousel-button']}>
                  <button type="button"><FormattedMessage id="chatroom.chat.chooseVariant"/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

export default CarouselMessage;

/* eslint-disable */
CarouselMessage.propTypes = {
  responses: PropTypes.any,
  createdAt: PropTypes.string
}
/* eslint-enable */
