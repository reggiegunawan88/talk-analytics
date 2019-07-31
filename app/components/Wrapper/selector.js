import { createSelector } from 'reselect';

const getState = state => {
  const {
    userLogged,
    profile,
    notification,
    lang,
    userMenu,
    userChannel,
  } = state;
  return { userLogged, profile, notification, lang, userMenu, userChannel };
};

export default createSelector(
  [getState],
  state => {
    const {
      userLogged,
      notification,
      lang,
      userMenu,
      profile,
      userChannel,
    } = state;
    const { token, isValid, googleUser } = userLogged;
    const { name, channelId, email, channel } = profile;
    const { menus, pages } = userMenu;
    const { isVisible } = notification;
    const { activeChannel } = userChannel;
    const data = {
      token,
      isValid,
      googleUser,
      name,
      notification: { isVisible },
      lang,
      wideNotif: menus.length === 0,
      activeChannel,
      pages,
      channels: channelId,
      profileChannel: channel,
      email
    };
    return data;
  }
);
