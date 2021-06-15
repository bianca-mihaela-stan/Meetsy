import React from 'react';
import { Component } from 'react';
import { AuthUserContext, withAuthorization } from '../Session';
import { PasswordForgetForm } from '../PasswordForget';


class AccountPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<AuthUserContext.Consumer>
      {authUser => (
        <div>
          <h1>Account: {this.props.firebase.authUser.username}</h1>
          <PasswordForgetForm />
        </div>
      )
      }
    </AuthUserContext.Consumer>
    )
  }
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(AccountPage);