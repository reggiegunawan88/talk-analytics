import React from 'react';
import { FormattedTime } from 'react-intl';

import PropTypes from 'prop-types';

import styles from '../../style.scss';

const ImageMessage = ({ contents, createdAt, onClick, type }) => (
  <div className="message clearfix">
    <div
      className={`chat-bubble ${
        type === 'message'
          ? `from-them ${styles['adjusted-from-them']}`
          : `from-me ${styles['adjusted-from-me']}`
      }`}
    >
      {contents.map((c, idx) => (
        <div key={idx} onClick={() => onClick(c)} role="none">
          <img
            className={styles['chat-bubble__img']}
            src={c}
            alt=""
            key={`img-${c}-${idx}`}
          />
        </div>
      ))}
    </div>
    <div className={styles.chat__time}>
      <FormattedTime value={new Date(createdAt)} hour12={false} />
    </div>
  </div>
);

export default ImageMessage;

/* eslint-disable */
ImageMessage.propTypes = {
  contents: PropTypes.any.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string,
  createdAt: PropTypes.string,
};
/* eslint-enable */
