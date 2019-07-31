import { createSelector } from 'reselect';

const getState = state => {
  const { userMenu, userChannel, profile } = state;
  const { activeChannel } = userChannel;
  const { menus } = userMenu;
  const { channelId } = profile;
  return { menus, activeChannel, channelId };
};

export default createSelector(
  [getState],
  state => {
    const { menus, activeChannel, channelId } = state; 
    return { widePage: menus.length === 0 || ( channelId && !channelId.length ), activeChannel };
  }
);
