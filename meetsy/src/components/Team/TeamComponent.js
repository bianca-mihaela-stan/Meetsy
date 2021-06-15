import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';
import { withRouter } from "react-router";
import { compose } from 'recompose';
import { domainName } from '../../constants/domainName';
import { form, StyledSmallTextArea, StyledSmallInput, StyledSmallButton, errorMsg, successMsg } from '../../constants/designConstants';

const inputField = {
  color: 'black'
}

class TeamComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      editText: "",
      addMemberMode: false,
      userEmail: "",
      loading: false,
      members: [],
      team: null,
      loadingTeam: false,
      condition: null,
      meetings: [],

      title: null,
      description: null,
      startDate: null,
      startTime: null,
      duration: null,

      error: null,
      success: null
    };
  }

  componentDidMount() {
    const { match: { params } } = this.props;
    this.setState({ loadingTeam: true });

    this.unsubscribe = this.props.firebase
      .team(params.teamId)
      .onSnapshot(snapshot => {
        if (snapshot.exists) {
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
          this.onListenForMembers();
          this.onListenForMeetings();
        }
      });

  }

  onListenForMembers = () => {
    this.setState({ loading: true });
    // this.props.firebase.usersByIds(this.props.team.uid)
    this.unsubscribe = this.props.firebase.users()
      .onSnapshot(snapshot => {
        let members = [];
        console.log("here in TeamComponent.js!");
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

  onListenForMeetings = () => {
    this.setState({ loading: true });
    console.log("Listen for Meetings");

    this.unsubscribe = this.props.firebase.meetings()
      .onSnapshot(snapshot => {
        let meetings = [];

        snapshot.forEach(doc => {
          console.log(doc.data());
          if (doc.data().teamId === this.state.team.uid) {
            meetings.push({ ...doc.data(), uid: doc.id })
          }
        });

        this.setState({
          meetings: meetings,
          loading: false
        });

      });
  }

  componentWillUnmount() {
    // apelam metoda asta ca sa incetam sa ascultam schimbarile colectiei din bd
    this.unsubscribe();
  }

  onRemoveMember = (team, memberId) => {

    if (this.props.firebase.authUser.uid === memberId) {
      return;
    }

    const { members } = this.state;
    var currentMember = members.find(u => u.userId === memberId);
    var oldTeams = currentMember.teams;
    console.log(oldTeams);
    this.props.firebase.team(team.uid).update({
      members: members.map(u => u.userId).filter(id => id !== memberId)
    });

    this.props.firebase.user(memberId).update({
      teams: oldTeams.filter(id => id !== team.uid)
    })
  }

  onLeaveTeam = (team, memberId) => {
    const { members } = this.state;
    this.onRemoveMember(team, memberId)
    if (members.length === 1) {
      this.onRemoveTeam(team.uid);
    }
  }

  onAddMember = (team) => {
    const { members } = this.state;
    this.props.firebase.userByEmail(this.state.userEmail).get().then(query => {
      query.forEach(doc => {
        if (doc.exists) {
          const user = doc.data();
          console.log(user, typeof (user));
          var newMembers = members.map(u => u.userId);
          newMembers.push(user.userId)
          this.props.firebase.team(team.uid).update({
            members: newMembers
          });
          var newTeams = user.teams;

          if (!newTeams.includes(team.uid)) {
            newTeams.push(team.uid);
          }
          this.props.firebase.user(user.userId).update({
            teams: newTeams
          })
        }
        else {
          console.log("No such user!");
        }
      })
    }
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

    this.props.firebase.users()
      .onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          // daca userul apartine team-ului cu uid
          if (doc.data().teams.includes(uid)) {
            // retinem team-urile de acum
            var oldTeams = doc.data().teams;
            // facem update la bd cu team-urile filtrate
            this.props.firebase.user(doc.data().userId).update({
              teams: oldTeams.filter(id => id !== uid)
            });
          }
        }
        );
      });

    //trebuie sa redirectionam userul
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

  onChangeText = (event, field) => {
    if (field === 'title') {
      this.setState({ title: event.target.value });
    }
    else if (field === 'description') {
      this.setState({ description: event.target.value });
    }
  };

  onChangeTime = event => {
    let time = event.target.value.split(":");
    let hours = time[0] * 3600 * 1000; // in miliseconds
    let minutes = time[1] * 60 * 1000; // in miliseconds
    this.setState({ startTime: hours + minutes });
  }

  onChangeDate = event => {
    let date = event.target.value.split('-');
    let year = date[0];
    let month = date[1] - 1;
    let day = date[2];
    let newDate = new Date(year, month, day);
    this.setState({ startDate: newDate });
  }

  onChangeDuration = event => {
    let duration = event.target.value;
    duration = duration * 3600 * 1000;  // milliseconds
    this.setState({ duration: duration });
  }

  onAddMeeting = event => {
    event.preventDefault();
    console.log(this.state);
    let { startDate, startTime, duration, title, description } = this.state;

    this.setState({
      success: null,
      error: null
    });

    if (startDate === null || startTime === null || duration === null || title === null || description === null) {
      console.log("Invalid")
      console.log(startDate);
      console.log(startTime);
      console.log(duration);
      console.log(title);
      console.log(description);
      this.setState({ error: "Invalid field value" });
      return;
    }

    startDate.setSeconds(startTime / 1000);
    let endDate = new Date(startDate.getTime());
    endDate.setSeconds(duration / 1000);

    let link = this.generateMeetingLink();

    this.props.firebase.events().add({
      title: title,
      description: description,
      startDate: startDate,
      endDate: endDate,
      private: false,
      userId: this.props.firebase.authUser.uid,
      meetingLink: link
    });

    this.props.firebase.meetings().add({
      title: title,
      startDate: startDate,
      endDate: endDate,
      teamId: this.state.team.uid,
      meetingLink: link
    });

    this.setState({
      title: null,
      description: null,
      startDate: null,
      startTime: null,
      duration: null,
      success: "Meeting sheduled successfully"
    });

  }

  generateMeetingLink() {
    var link = domainName + 'meet/';
    link += this.state.team.uid + '-';
    link += this.state.title.replaceAll(' ', '-');
    return link;
  }

  compare(a, b) {
    if (a.title.toLowerCase() < b.title.toLowerCase())
      return -1;
    if (a.title.toLowerCase() > b.title.toLowerCase())
      return 1;
    return 0;
  }

  render() {
    const { editMode, editText, members, loading, addMemberMode, userEmail, team, loadingTeam, condition, meetings, title, description, error, success } = this.state;

    meetings.sort(this.compare);

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {loadingTeam && <div>Loading...</div>}
            {team && (
              <div>
                {condition(authUser.uid) && editMode ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={this.onChangeEditText}
                    style={inputField}
                  />
                ) : (
                  <span>
                    <h1><strong>{team.name}</strong></h1>
                    {team.uid}
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
                {members && (<div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <h3>Team members</h3>
                    <ul> {
                      //  pentru fiecare echipa afisam o componenta corezpunzatoare
                      // de tipul Team
                      members.map(member => (
                        <div>
                          <li>{member.email}</li>
                          {condition(authUser.uid) && !editMode && this.props.firebase.authUser.email !== member.email && (
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
                          style={inputField}
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
                        <button type="button"
                          onClick={() => this.onLeaveTeam(team, authUser.uid)}>
                          Leave Team
                        </button>
                      ) :
                        <span></span>
                    }
                  </div>

                  <div style={{ marginRight: '10pc' }}>
                    <h3>Scheduled Meetings</h3>
                    <ul>{
                      meetings.length === 0
                        ? <li>No meetings yet</li>
                        :
                        meetings.map(meeting => (
                          <div>
                            <li>
                              {meeting.title}
                              <ul>
                                <li>Start Date: {meeting.startDate.toDate().toLocaleString('en-RO')}</li>
                                <li>End Date: {meeting.endDate.toDate().toLocaleString('en-RO')}</li>
                                <li>Meeting address: <a target="_blank" rel="noreferrer" href={meeting.meetingLink}>{meeting.meetingLink}</a></li>
                              </ul>
                            </li>
                            {console.log(meeting)}
                          </div>

                        ))
                    }
                    </ul>
                  </div>

                  {condition(authUser.uid) &&
                    <div>
                      <form
                        style={{ ...form, marginRight: '10pc' }}
                        onSubmit={this.onAddMeeting}
                      >
                        <h3>Schedule a new meeting</h3>
                        <br></br>
                        <h6 style={{ textAlign: 'center' }}>Start Date</h6>
                        <StyledSmallInput
                          type="date"
                          id="eventStartDate"
                          onChange={this.onChangeDate}
                          placeholder="Start date"
                        />
                        <h6 style={{ textAlign: 'center' }}>Start Time</h6>
                        <StyledSmallInput
                          type="time"
                          id="eventStartTime"
                          onChange={this.onChangeTime}
                        />
                        <h6 style={{ textAlign: 'center' }}>Duration</h6>
                        <StyledSmallInput
                          type="number"
                          step="0.5"
                          min="0.5"
                          max="10"
                          id="eventStartTime"
                          onChange={this.onChangeDuration}
                        />
                        <h6 style={{ textAlign: 'center' }}>Event Title</h6>
                        <StyledSmallInput
                          type="text"
                          id="eventTitle"
                          value={title}
                          onChange={(e) => this.onChangeText(e, 'title')}
                        />
                        <h6 style={{ textAlign: 'center' }}>Event Description</h6>
                        <StyledSmallTextArea
                          type="textarea"
                          id="eventDescription"
                          value={description}
                          onChange={(e) => this.onChangeText(e, 'description')}
                        />
                        <StyledSmallButton type="submit">Schedule meeting</StyledSmallButton>

                        {success !== null && <p style={successMsg}>{success}</p>}
                        {error !== null && <p style={errorMsg}>{error}</p>}
                      </form>


                    </div>
                  }

                </div>
                )}
              </div>
            )}
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default compose(withFirebase, withRouter)(TeamComponent);