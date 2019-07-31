import { createSelector } from 'reselect';

const getState = state => {
    const { activeChannel } = state.userChannel;
    return { activeChannel };
};

export default createSelector([getState], state => state);