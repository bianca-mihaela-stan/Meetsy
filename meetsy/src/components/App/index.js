import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Column, Row } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite';
import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import CalendarPage from '../Calendar';
import AdminPage from '../Admin';
import Room from '../Room';
import Meet from '../Meet'

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

const styles = StyleSheet.create({
  container: {
    height: '100vh'
  },
  content: {
    marginTop: 54
  },
  mainBlock: {
    // backgroundColor: '#F7F8FC',
    // #1C1F21
    backgroundColor: '#131516',
    padding: 30
  }
});

const App = () => (

  <Router>
    <div>
      <Row className={css(styles.container)}>
        <Navigation />
        <Column flexGrow={1} className={css(styles.mainBlock)}>
          <Route exact path={ROUTES.LANDING} component={LandingPage} />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route
            path={ROUTES.PASSWORD_FORGET}
            component={PasswordForgetPage}
          />
          <Route path={ROUTES.ROOM} component={Room} />
          <Route path={ROUTES.HOME} component={HomePage} />
          <Route path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route path={ROUTES.ADMIN} component={AdminPage} />
          <Route path={ROUTES.CALENDAR} component={CalendarPage} />
          <Route path="/meet/:url" component={Meet} />
        </Column>
      </Row>
    </div>
  </Router>

);

export default withAuthentication(App);