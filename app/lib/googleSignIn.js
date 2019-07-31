export const googleLogin = onSuccess => {
  let user;
  const auth = window.gapi.auth2.getAuthInstance();
  auth.signIn().then(
    res => {
      const googleUser = res;
      const authResp = googleUser.getAuthResponse();
      const basicProfile = googleUser.getBasicProfile();
      onSuccess(authResp.id_token, {
        fname: basicProfile.getGivenName(),
        lname: basicProfile.getFamilyName(),
        email: basicProfile.getEmail(),
      });
    },
    e => {
      console.error(e);
    }
  );

  return user;
};

export const googleAuth = () => {
  if (window.gapi) {
    return window.gapi.auth2
      .getAuthInstance()
      .currentUser.get()
      .getAuthResponse();
  }
  return null;
};

export const googleLogout = () => {
  if (window.gapi) {
    window.gapi.auth2.getAuthInstance().signOut();
  }
};

export default (handleLogin = () => {}, handleFail = () => {}) => {
  ((d, s, id, cb) => {
    const element = d.getElementsByTagName(s)[0];
    const fjs = element;
    let js = element;
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://apis.google.com/js/api.js';
    if (fjs && fjs.parentNode) {
      fjs.parentNode.insertBefore(js, fjs);
    } else {
      d.head.appendChild(js);
    }
    js.onload = cb;
  })(document, 'script', 'google-login', () => {
    const params = {
      client_id: process.env.GOOGLE_CLIENT_ID,
    };

    window.gapi.load('auth2', () => {
      if (!window.gapi.auth2.getAuthInstance()) {
        window.gapi.auth2.init(params).then(
          res => {
            if (res.isSignedIn.get()) {
              const googleUser = res.currentUser.get();
              const authResp = googleUser.getAuthResponse();
              const basicProfile = googleUser.getBasicProfile();
              handleLogin(authResp.id_token, {
                fname: basicProfile.getGivenName(),
                lname: basicProfile.getFamilyName(),
                email: basicProfile.getEmail(),
              });
            } else {
              handleFail();
            }
          },
          err => {
            console.error(err);
          }
        );
      }
    });
  });
};
