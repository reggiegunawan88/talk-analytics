import { createSelector } from 'reselect';

const getState = state => {
    const { userOrder } = state;
    return { userOrder };
};

export default createSelector(
    [getState],
    state => {
        const { userOrder } = state;
        const {
            orders,
            currentPage,
            filteredOrder,
            filter,
            isFetching,
            hasMoreData,
            notesDetail,
        } = userOrder;

        return {
            orders,
            currentPage,
            filteredOrder,
            filter,
            isFetching,
            hasMoreData,
            notesDetail
        };
    }
);
