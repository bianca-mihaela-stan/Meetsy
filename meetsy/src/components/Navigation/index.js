import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import { Column } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import IconHome from '../../assets/icon-home.js';
import IconAccount from '../../assets/icon-account.js';
import IconCall from '../../assets/icon-call.js';
import IconCalendar from '../../assets/icon-calendar.js';
import MenuItemComponent from './MenuItemComponent';
import IconBookmark from '../../assets/icon-bookmark.js';
import ProfileImage from './ProfileImage';
const styles = StyleSheet.create({
  container: {
    //'#0e0f10
    backgroundColor: '#090A0B',
    width: '6vw',
    overflow: 'hidden',
    // borderRight: '1px solid',
    borderColor: '#363336'

  },
  menuCtn: {
    height: '96vh',
    marginBottom: '4vh'
  },
  menuItemList: {
    marginTop: '14vh'
  },
  separator: {
    borderTop: '1px solid #DFE0EB',
    marginTop: 16,
    marginBottom: 16,
    opacity: 0.06
  }
});

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : void 0
      }
    </AuthUserContext.Consumer>
  </div>
);
const NavigationAuth = () => (
  <Column className={css(styles.container)} >
    <Column className={css(styles.menuCtn)} >
      <Column className={css(styles.menuItemList)} >
        <MenuItemComponent
          path={ROUTES.HOME}
          title="Home" icon={IconHome}
        />
        <MenuItemComponent
          path={ROUTES.ACCOUNT}
          title="Account" icon={IconCalendar}
        />
        <MenuItemComponent
          path={ROUTES.ROOM}
          title="Account" icon={IconCall}
        />
          {/* <SignOutButton /> */}
      </Column>
      <Column flexGrow={1}></Column>
     <SignOutButton />
      {/* <ProfileImage 
      path={ROUTES.ACCOUNT}
      title="Profile"
      size = "47px"
      content="https://live.staticflickr.com/2942/15151618028_b3132b52d8_b.jpg">
      </ProfileImage> */}
    </Column>
  </Column>
);
const NavigationNonAuth = () => (
  <ul>
    <li>
      <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </li>
    <li>
      <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    </li>
  </ul>
);

export default Navigation;