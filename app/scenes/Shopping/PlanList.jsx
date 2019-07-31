import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';

import Button from 'shared_components/Button';
import { configValues } from 'Config';
import styles from './styles.scss';

class PlanList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showFeatures: false,
      plan: 'enterprise',
    };

    this.onPlanChange = this.onPlanChange.bind(this);
    this.showFeaturesChange = this.showFeaturesChange.bind(this);
  }

  componentDidMount(){
    if (this.props.planChoose) {
      this.onPlanChange(this.props.planChoose);
    }
  }

  onPlanChange(plan) {
    this.setState({ plan });
  }

  showFeaturesChange() {
    this.setState({ showFeatures: !this.state.showFeatures });
  }

  render() {
    return (
      <div className={styles['shopping--container']}>
        <div className={styles['shopping--outer-container']}>
          <h5 className={`text-center m-b-50 ${styles['title-plan']}`}>
            <FormattedMessage id="shopping.choosePlan" />
          </h5>
          <div className={styles['shopping__plans-container']}>
            {this.props.plans.map(plan => (
              <div
                className={`${styles['shopping__plans-option']} ${
                  plan.id === this.state.plan
                    ? styles['shopping__plans-active']
                    : ''
                }`}
                key={plan.id}
                onClick={() => this.onPlanChange(plan.id)}
                role="none"
              >
                <div className="m-b-15">
                  <img
                    height="24"
                    src={`/img/icon/shopping/${plan.id}.png`}
                    alt=""
                    className="m-r-10"
                  />
                  <b>{plan.name}</b>
                </div>

                {plan.price !== 0 ? (
                  <h3 className="semi-bold">
                    IDR{' '}
                    <p className="display-inline bold fs-35">
                      {plan.price}
                    </p>
                    <FormattedMessage id="shopping.priceUnit" />
                  </h3>
                ) : (
                  <h3
                    className={`semi-bold ${
                      styles.freePlan
                    } display-inline bold fs-35`}
                  >
                    Free
                  </h3>
                )}

                <hr />

                <p className="text-sand">{plan.description}</p>
                <div className={styles['shopping__plans-listfeature']}>
                  <ul>
                    {
                      plan.features.map( (feature, index) => feature && (<li key={`feature-${index}`}><i className="fa fa-check" /> {feature}</li>))
                    }
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              className={`btn btn-primary border-primary m-t-20 m-b-40 ${styles['shopping--upgrade']}`}
              onClick={() => this.props.onUpgrade(this.state.plan)}
            >
              <FormattedMessage
                id='shopping.upgrade'
              />
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default PlanList;

/* eslint-disable */
PlanList.propTypes = {
  plans: PropTypes.array.isRequired,
  onUpgrade: PropTypes.func.isRequired,
  planChoose: PropTypes.string.isRequired,
};
/* eslint-enable */
