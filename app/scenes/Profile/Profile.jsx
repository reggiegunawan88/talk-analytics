import React from 'react';

import Page from 'shared_components/Page';
import UserCard from './components/UserCard';

const Profile = () => (
  <Page>
    <div className="row m-t-30">
      <div className="col-md-7">
        <UserCard />
      </div>
    </div>
  </Page>
);

export default Profile;
