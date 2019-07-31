import React, { PureComponent } from 'react';

import PropTypes from 'prop-types';
import * as _ from 'lodash';

import styles from './styles.scss';

class Stepper extends PureComponent {
  render() {
    const { listStep, activeStep, skipStep } = this.props;

    return (
      <div className={styles.stepper}>
        {listStep.map((list, index) => {
          const isSkip = _.indexOf(skipStep, list);
          return (
            <li
              key={index}
              className={`  
                ${index === activeStep ? styles.stepper__active : ''} 
                ${
                  index < activeStep && isSkip < 0
                    ? styles["stepper--step-done"]
                    : ''
                } 
              `}
            >
              <div className={styles.stepper__icon}>
                <span>
                  {isSkip < 0 && index < activeStep ? (
                    <i className="fa fa-check" />
                  ) : (
                    index + 1
                  )}
                </span>
              </div>
              <p>{list}</p>
            </li>
          );
        })}
      </div>
    );
  }
}

export default Stepper;

/* eslint-disable */
Stepper.propTypes = {
  listStep: PropTypes.array,
  activeStep: PropTypes.any,
  skipStep: PropTypes.array,
};
