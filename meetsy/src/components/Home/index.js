import React from 'react';
import { Component } from 'react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import {compose} from 'recompose';

class Home extends Component {
  constructor(props){
    super(props);
  }
 
  render() {

    return (
      <div>
      <h1>Welcome back, {this.props.firebase.authUser.username}</h1>
      <p>The Home Page is accessible by every signed in user.</p>
     
    </div>
    )
  }
}
const condition = authUser => !!authUser;
export default compose (withFirebase, withAuthorization(condition))(Home);