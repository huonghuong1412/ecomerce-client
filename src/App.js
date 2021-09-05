import './App.css';
import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { authentication } from './utils/Authentication'
import ScrollToTop from './ScrollToTop';

import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'

import HomePage from './pages/customer/HomePage'
import LoginPage from './pages/customer/LoginPage'
import RegisterPage from './pages/customer/RegisterPage'
import ProfilePage from './pages/customer/ProfilePage'
import NotFoundPage from './pages/customer/NotFound'

import DetailProduct from './pages/customer/DetailProduct';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { logout, setCurrentUser } from './actions/services/UserActions';
import CartPage from './pages/customer/CartPage';
import PaymentPage from './pages/customer/PaymentPage';
import ResultOrderPage from './pages/customer/ResultOrderPage';
import HistoryOrder from './pages/customer/HistoryOrder';
import CustomerAddress from './pages/customer/CustomerAddress';
import HistoryOrderDetail from 'pages/customer/HistoryOrderDetail';
import { Suspense } from 'react';
import CustomerWishlist from 'pages/customer/CustomerWishlist';
import ListProductViewed from 'pages/customer/ListProductViewed';
// import Loading from 'components/Loading/Loading';
const ListProductPage = React.lazy(() => import('./pages/customer/ListProductPage'));

function App() {

  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      dispatch(setCurrentUser(decoded));
      if (Date.now() / 1000 > decoded.exp) {
        dispatch(logout());
      }
    }
  }, [dispatch, token]);

  return (
    <Suspense fallback={''}>
      <Router>
        <ScrollToTop />
        <Header />
        <div className="app__container">
          <div className="grid wide">

            <Switch>

              <PrivateRoute exact path="/my-profile" component={ProfilePage} />
              <PrivateRoute exact path="/customer/address" component={CustomerAddress} />
              <PrivateRoute exact path="/customer/wishlist" component={CustomerWishlist} />
              <PrivateRoute exact path="/customer/viewed" component={ListProductViewed} />
              <PrivateRoute exact path="/checkout/payment" component={PaymentPage}></PrivateRoute>
              <PrivateRoute exact path="/success/payment" component={ResultOrderPage}></PrivateRoute>
              <PrivateRoute exact path="/customer/order/history" component={HistoryOrder}></PrivateRoute>
              <PrivateRoute exact path="/customer/order/history/detail/:id" component={HistoryOrderDetail}></PrivateRoute>

              <PublicRoute exact path="/" component={HomePage} />
              <PublicRoute exact path="/login" component={LoginPage} />
              <PublicRoute exact path="/register" component={RegisterPage} />
              <Route exact path="/checkout/cart" component={CartPage}></Route>
              <Route exact path="/search" render={(props) => <ListProductPage {...props} key={props.location.key} />}></Route>
              <Route exact path="/:category" render={(props) => <ListProductPage {...props} key={props.location.key} />}></Route>
              <Route exact path="/:category/:subcategory" render={(props) => <ListProductPage {...props} key={props.location.key} />}></Route>
              <Route exact path="/san-pham/:id/:slug" render={(props) => <DetailProduct {...props} key={props.location.key} />}></Route>



              <PublicRoute exact path="*" component={NotFoundPage} />
            </Switch>

          </div>
        </div>
        <Footer />
      </Router>
    </Suspense>
  );
}

function PublicRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => (
        <Component {...props} />
      )}
    />
  )
}

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => (
        authentication.isAuthentication() ?
          <Component {...props} /> :
          <Redirect to="/login" />
      )}
    />
  )
}

export default App;
