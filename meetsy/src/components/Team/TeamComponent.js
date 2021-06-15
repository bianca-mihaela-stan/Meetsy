import React, { Component } from 'react';
import { useParams } from 'react-router';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import { AuthUserContext } from '../Session';
import { withRouter } from "react-router";
import { compose } from 'recompose';

class TeamComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      editText:"",
      addMemberMode: false,
      userEmail: "",
      loading: false,
      members: [],
      team: null,
      loadingTeam: false,
      condition: null
    };
    console.log(props);
   

  }

  componentDidMount() {
    const { match: { params } } = this.props;
    this.setState({loadingTeam: true});
   
    this.unsubscribe = this.props.firebase
      .team(params.teamId)
      .onSnapshot(snapshot => {
          if(snapshot.exists){
        const tempTeam = snapshot.data();
        tempTeam.uid = params.teamId;
        
        this.setState({
          team: tempTeam,
          loadingTeam: false,
          condition: id => id === this.state.team.ownerId
        });
        this.setState({
            editText: this.state.team.name
        });
        this.onListenForMembers();}
      });
    
  }
  onListenForMembers = () => {
    this.setState({ loading: true });
    // this.props.firebase.usersByIds(this.props.team.uid)
    this.unsubscribe = this.props.firebase.users()
      .onSnapshot(snapshot => {
        let members = [];
        console.log("here!");
        snapshot.forEach(doc => {
          if (this.state.team.members.includes(doc.id))
            members.push({ ...doc.data(), uid: doc.id })
        }
        );
        console.log("Membrii: ", members);
        this.setState({
          members: members,
          loading: false,
        });
      });

  }
  componentWillUnmount() {
    // apelam metoda asta ca sa incetam sa ascultam schimbarile colectiei din bd
    this.unsubscribe();
  }
  onRemoveMember = (team, memberId) => {
    const { members } = this.state;
    var currentMember = members.find(u => u.userId == memberId);
    var oldTeams = currentMember.teams;
    console.log(oldTeams);
    this.props.firebase.team(team.uid).update({
      members: members.map(u => u.userId).filter(id => id != memberId)
    });

    this.props.firebase.user(memberId).update({
      teams: oldTeams.filter(id => id != team.uid)
    })
  }
  onLeaveTeam = (team, memberId) => {
    const {members} = this.state;
    this.onRemoveMember(team,memberId)
    if(members.length == 1){
       this.onRemoveTeam(team.uid);
    }
  }
  onAddMember = (team) => {
    const { members } = this.state;
    this.props.firebase.userByEmail(this.state.userEmail).get().then(query => {
     query.forEach(doc => { if (doc.exists) {
        const user = doc.data();
        console.log(user, typeof (user));
        var newMembers = members.map(u => u.userId);
        newMembers.push(user.userId)
        this.props.firebase.team(team.uid).update({
          members: newMembers
        });
        var newTeams = user.teams;
        newTeams.push(team.uid);
        this.props.firebase.user(user.userId).update({
          teams: newTeams
        })
      }
      else {
        console.log("No such user!");
      }
    })}
    ).catch((error) => {
      console.log("Error getting document:", error);
    });
  }
  onEditTeam = (team, text) => {
    console.log("Echipa este:", team);
    this.props.firebase.team(team.uid).update({
      name: text
    });
  };

  onRemoveTeam = uid => {
    this.props.firebase.team(uid).delete();
    //trebuie sa redirectionaam userul
    this.props.history.push('/team');
  };

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.state.team.name,
    }));
  };
  onToggleAddMemberMode = () => {
    this.setState(state => ({
      addMemberMode: !state.addMemberMode
    }));
  };

  onChangeEditText = event => {
    this.setState({ editText: event.target.value });
  };
  onChangeEditEmail = event => {
    this.setState({ userEmail: event.target.value })
  }

  onSaveEditText = () => {
    this.onEditTeam(this.state.team, this.state.editText);
    this.setState({ editMode: false });
  };


  render() {
    const { editMode, editText, members, loading, addMemberMode, userEmail, team, loadingTeam, condition } = this.state;
    return (
        <AuthUserContext.Consumer>
            {authUser => (
      <li>
          {loadingTeam && <div>Loading...</div>}
          {team && (
              <div>
        {condition(authUser.uid) && editMode ? (
          <input
            type="text"
            value={editText}
            onChange={this.onChangeEditText}
          />
        ) : (
          <span>
            <strong>{team.uid}</strong> {team.name}

          </span>
        )}

        {condition(authUser.uid) && (
          <span>
            {editMode ? (
              <span>
                <button onClick={this.onSaveEditText}>Save</button>
              </span>
            ) : (
              <button onClick={this.onToggleEditMode}>Edit</button>
            )}

            {!editMode && (
              <button
                type="button"
                onClick={() => this.onRemoveTeam(team.uid)}
              >
                Delete
              </button>
            )}
          </span>
        )}
        {loading && <div>Loading ...</div>}
        {members && (<div>
          <ul> {
            //  pentru fiecare echipa afisam o componenta corezpunzatoare
            // de tipul Team
            members.map(member => (
              <div>

                <li>{member.email}</li>
                {condition(authUser.uid) && !editMode && (
                  <button
                    type="button"
                    onClick={() => this.onRemoveMember(team, member.userId)}
                  >
                    Delete Member
                  </button>
                )}
              </div>
            ))}
          </ul>
          {condition(authUser.uid) && (addMemberMode ? (
          <div>
            <input
              type="text"
              value={userEmail}
              onChange={this.onChangeEditEmail}
            />
            <button
              type="button"
              onClick={() => this.onAddMember(team)}
            >
              Add
                  </button>
            <button onClick={this.onToggleAddMemberMode}>Close</button>
          </div>)
            :
            <button onClick={this.onToggleAddMemberMode}>Add member</button>
          )}
          {
             (!!(condition(authUser.id)) && team.members.includes(authUser.uid)) ? (
             <button type ="button"
             onClick = {() => this.onLeaveTeam(team, authUser.uid)}>
               Leave Team
             </button>
             ):
             <span></span>
          }
        </div>
        )}
        </div>
        )}
      </li>
      )}
      </AuthUserContext.Consumer>
    );
  }
}

export default compose(withFirebase, withRouter)(TeamComponent);