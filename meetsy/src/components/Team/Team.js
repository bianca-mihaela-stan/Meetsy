import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';

class Team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      editText: this.props.team.name,
      addMemberMode: false,
      userEmail: "",
      loading: false,
      members: []
    };
    console.log(props);
    this.condition = id => id === this.props.team.ownerId;
  }

  componentDidMount() {
    this.onListenForMembers();
  }
  onListenForMembers = () => {
    this.setState({ loading: true });
    // this.props.firebase.usersByIds(this.props.team.uid)
    this.unsubscribe = this.props.firebase.users()
      .onSnapshot(snapshot => {
        let members = [];
        console.log("here!");
        snapshot.forEach(doc => {
          if (this.props.team.members.includes(doc.id))
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
    this.props.firebase.team(team.uid).update({
      name: text
    });
  };

  onRemoveTeam = uid => {
    this.props.firebase.team(uid).delete();
  };

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.team.name,
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
    this.onEditTeam(this.props.team, this.state.editText);
    this.setState({ editMode: false });
  };


  render() {
    const { authUser, team, firebase } = this.props;
    const { editMode, editText, members, loading, addMemberMode, userEmail } = this.state;

    return (
      <li>
        {this.condition(authUser.uid) && editMode ? (
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

        {this.condition(authUser.uid) && (
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
                {this.condition(authUser.uid) && !editMode && (
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
          {this.condition(authUser.uid) && (addMemberMode ? (
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
             (!!(this.condition(authUser.id)) && this.props.team.members.includes(authUser.uid)) ? (
             <button type ="button"
             onClick = {() => this.onLeaveTeam(team, authUser.uid)}>
               Leave Team
             </button>
             ):
             <span></span>
          }
        </div>
        )}
        
      </li>
    );
  }
}

export default withFirebase(Team);