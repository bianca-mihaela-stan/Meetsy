import React from 'react';
import { Component } from 'react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myTeams: [],
      loading: false
    }
  }

  componentDidMount() {
    this.onGetTeams();
  }

  onGetTeams = () => {
    this.setState({ loading: true });

    this.unsubscribe = this.props.firebase.users()
      .onSnapshot(snapshot => {

        let myTeams = [];
        console.log("GETTING TEAMS");

        snapshot.forEach(doc => {
          console.log(doc.data());
          console.log(this.props.firebase.authUser.teams);
          myTeams = this.props.firebase.authUser.teams;
        });

        console.log("echipe:", myTeams);

        this.setState({
          myTeams: myTeams,
          loading: false
        });

      });
  }

  render() {

    return (
      <div>
        <h1>Welcome back, {this.props.firebase.authUser.username}</h1>
        <p>The Home Page is accessible by every signed in user.</p>
        <p>You are a member of {this.state.myTeams.length} teams.</p>
      </div>
    )
  }
}

const condition = authUser => !!authUser;
export default compose(withFirebase, withAuthorization(condition))(Home);