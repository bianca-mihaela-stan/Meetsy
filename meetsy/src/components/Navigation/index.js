import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import { Column } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import IconHome from '../../assets/icon-home.js';
import IconAccount from '../../assets/icon-account.js';
import MenuItemComponent from './MenuItemComponent';
import IconBookmark from '../../assets/icon-bookmark.js';
import ProfileImage from './ProfileImage';
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0e0f10',
    width: '10vw',
    overflow: 'hidden',
    // borderRight: '1px solid',
    borderColor: '#363336'

  },
  menuCtn: {
    height: '100vh'
  },
  menuItemList: {
    marginTop: 32
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
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);
const NavigationAuth = () => (
  <Column className={css(styles.container)}>
    <Column className={css(styles.menuCtn)}>
      <Column className={css(styles.menuItemList)}>
        <MenuItemComponent
          path={ROUTES.HOME}
          title="Home" icon={IconHome}
        />
        <MenuItemComponent
          path={ROUTES.ACCOUNT}
          title="Account" icon={IconAccount}
        />
        <MenuItemComponent
          path={ROUTES.ROOM}
          title="Account" icon={IconBookmark}
        />
      </Column>
      <Column flexGrow={1}></Column>
      <ProfileImage 
      path={ROUTES.ACCOUNT}
      title="Profile"
      content="https://live.staticflickr.com/2942/15151618028_b3132b52d8_b.jpg">
      </ProfileImage>
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