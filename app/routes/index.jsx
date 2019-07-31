import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import Loadable from 'react-loadable';

import Wrapper from '../components/Wrapper';
import PageLoader from '../components/PageLoader';

import paths from '../config/paths';

const Login = Loadable({
  loader: () => import(/* webpackChunkName: "login" */ '../scenes/Login'),
  loading: PageLoader,
  delay: 200,
});

const Register = Loadable({
  loader: () => import(/* webpackChunkName: "register" */ '../scenes/Register'),
  loading: PageLoader,
  delay: 200,
});

const Profile = Loadable({
  loader: () => import(/* webpackChunkName: "profile" */ '../scenes/Profile'),
  loading: PageLoader,
  delay: 200,
});

const ChannelManagement = Loadable({
  loader: () =>
    import(/* webpackChunkName: "channel-management" */ '../scenes/ChannelManagement'),
  loading: PageLoader,
  delay: 200,
});

const Shopping = Loadable({
  loader: () => import(/* webpackChunkName: "shopping" */ '../scenes/Shopping'),
  loading: PageLoader,
  delay: 200,
});

const Analytics = Loadable({
  loader: () =>
    import(/* webpackChunkName: "analytics" */ '../scenes/Analytics'),
  loading: PageLoader,
  delay: 200,
});

const CustomFlow = Loadable({
  loader: () =>
    import(/* webpackChunkName: "custom-flow" */ '../scenes/CustomFlow'),
  loading: PageLoader,
  delay: 200,
});

const ChatRoom = Loadable({
  loader: () =>
    import(/* webpackChunkName: "chat-room" */ '../scenes/ChatRoom'),
  loading: PageLoader,
  delay: 200,
});

const Form = Loadable({
  loader: () => import(/* webpackChunkName: "form" */ '../scenes/Form'),
  loading: PageLoader,
  delay: 200,
});

const History = Loadable({
  loader: () => import(/* webpackChunkName: "history" */ '../scenes/History'),
  loading: PageLoader,
  delay: 200,
});

const Feedback = Loadable({
  loader: () => import(/* webpackChunkName: "feedback" */ '../scenes/Feedback'),
  loading: PageLoader,
  delay: 200,
});

const Users = Loadable({
  loader: () => import(/* webpackChunkName: "users" */ '../scenes/Users'),
  loading: PageLoader,
  delay: 200,
});

const Broadcast = Loadable({
  loader: () =>
    import(/* webpackChunkName: "broadcast" */ '../scenes/Broadcast'),
  loading: PageLoader,
  delay: 200,
});

const Order = Loadable({
  loader: () => import(/* webpackChunkName: "order" */ '../scenes/Order'),
  loading: PageLoader,
  delay: 200,
});

const ProductManagement = Loadable({
  loader: () =>
    import(/* webpackChunkName: "productmanagement" */ '../scenes/ProductManagement'),
  loading: PageLoader,
  delay: 200,
});

const Loyalty = Loadable({
  loader: () => import(/* webpackChunkName: "loyalty" */ '../scenes/Loyalty'),
  loading: PageLoader,
  delay: 200,
});

const Customers = Loadable({
  loader: () =>
    import(/* webpackChunkName: "customers" */ '../scenes/Customers'),
  loading: PageLoader,
  delay: 200,
});

const Product = Loadable({
  loader: () => import(/* webpackChunkName: "product" */ '../scenes/Product'),
  loading: PageLoader,
  delay: 200,
});

const Products = Loadable({
  loader: () => import(/* webpackChunkName: "products" */ '../scenes/Products'),
  loading: PageLoader,
  delay: 200,
});

export default (
  <Router>
    <Wrapper>
      <Switch>
        <Route path={paths.public.login} component={Login} />
        <Route path={paths.private.registerChannel} component={Register} />

        <Route path={paths.private.profile} component={Profile} />
        <Route
          path={paths.private.channelManagement}
          component={ChannelManagement}
        />
        <Route path={paths.private.shoppingPage} component={Shopping} />
        <Route path={paths.private.analytics} component={Analytics} />
        <Route path={paths.private.customFlow} component={CustomFlow} />
        <Route path={paths.private.chatRoom} component={ChatRoom} />
        <Route path={paths.private.forms} component={Form} />
        <Route path={paths.private.history} component={History} />
        <Route path={paths.private.users} component={Users} />
        <Route path={paths.private.broadcast} component={Broadcast} />
        <Route path={paths.private.feedback} component={Feedback} />
        <Route
          path={paths.private.productManagement}
          component={ProductManagement}
        />
        <Route path={paths.private.order} component={Order} />
        <Route path={paths.private.loyalty} component={Loyalty} />
        <Route path={paths.private.customers} component={Customers} />
        <Route path={paths.private.product} component={Product} />
        <Route path={paths.private.products} component={Products} />

        <Redirect to={paths.private.analytics} />
      </Switch>
    </Wrapper>
  </Router>
);
