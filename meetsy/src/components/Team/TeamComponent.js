import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';
import { withRouter } from "react-router";
import { compose } from 'recompose';
import { domainName } from '../../constants/domainName';
import { form, StyledSmallTextArea, StyledSmallInput, StyledSmallButton, errorMsg, successMsg } from '../../constants/designConstants';

import styled from 'styled-components';
import Grid from "@material-ui/core/Grid";
import { COLORS } from '../../constants/designConstants';
import Modal from '../Modal';
import IconDelete from '../../assets/icon-delete';
import IconEdit from '../../assets/icon-edit';
import IconBack from '../../assets/icon-back';
import IconAdd from '../../assets/icon-add';
import * as ROUTES from '../../constants/routes';
import { StyledInput, addButton, buttonAction, ButtonGroup, backButton, MeetsyButton } from '../../styles';
import { Row } from 'simple-flexbox';

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

      error: null,
      success: null,

      title: null,
      description: null,
      startDate: null,
      startTime: null,
      duration: null,
      loadingOwner: false,
      owner: null
    };
  };

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
          loading: false
        });

        if (this.state.team.ownerId) {
          this.setState({ owner: members.filter(u => u.userId === this.state.team.ownerId)[0] }, () => { console.log(this.state.owner) });
        }

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
    if (members.length == 1) {
      this.onRemoveTeam(team);
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

  onRemoveTeam = team => {
    Promise.all(this.state.members.map(u => {
      this.onRemoveMember(team, u.userId);
    })).then(() => {
      this.props.firebase.team(team.uid).delete();
      //trebuie sa redirectionaam userul
      this.props.history.push('/team');
    });
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
    const { editMode, editText, members, loading, userEmail, team, loadingTeam, condition, meetings, title, description, error, success } = this.state;

    meetings.sort(this.compare);

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <MainContainer>
            <TeamPanel>
              <h5 style={{ margin: '20px', marginLeft: '30px', position: 'absolute', bottom: '0', fontSize: '3.2rem' }}>{team && <span>{team.name}</span>}</h5>
              {team && condition(authUser.uid) && (
                <ButtonGroup>
                  <button style={buttonAction} onClick={this.onToggleEditMode}><IconEdit></IconEdit></button>
                  <button style={buttonAction}
                    onClick={() => this.onRemoveTeam(team)}
                  >
                    <IconDelete></IconDelete>
                  </button>
                </ButtonGroup>
              )}
            </TeamPanel>


            <InfoBox>
              <Link to={ROUTES.SHOW_TEAMS} style={{ ...buttonAction, ...backButton }}><IconBack></IconBack></Link>
              <TextBox> <h5 >About this course</h5>
                {team && team.description ? <p>{team.description}</p> : <p style={{ marginBottom: '0', textAlign: 'justify', color: '#E0E0E0' }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.</p>}
              </TextBox>
              <OwnerBox>
                <h5>Instructor</h5>
                {team && team.ownerId && this.state.owner && (<Row>
                  <ProfileCircle></ProfileCircle>
                  <ProfileDescription><p style={{ flexGrow: '1' }}>{this.state.owner.username}</p></ProfileDescription>
                  {/* <MeetsyButton>View</MeetsyButton> */}
                </Row>)}
              </OwnerBox>
            </InfoBox>

            {loadingTeam && <div>Loading...</div>}
            {team && (
              <div>
                {loading && <div>Loading ...</div>}
                {members && (<div>
                  <h5 style={{ display: 'inline' }}>Members</h5> {condition(authUser.uid) && (
                    <button style={{ ...buttonAction, ...addButton }} onClick={this.onToggleAddMemberMode}><IconAdd></IconAdd></button>
                  )}
                  <Grid container spacing={1}> {
                    //  pentru fiecare echipa afisam o componenta corezpunzatoare
                    // de tipul Team

                    members.map(member => (

                      <ProfileBox>
                        <ProfileCircle style={{ width: '50px', height: '50px' }}></ProfileCircle><ProfileDescription>{member.email}</ProfileDescription>
                        {condition(authUser.uid) && !editMode && team.ownerId && team.ownerId !== member.userId && (
                          <MeetsyButton
                            onClick={() => this.onRemoveMember(team, member.userId)}
                          >
                            Delete
                          </MeetsyButton>
                        )}
                      </ProfileBox>
                    ))}
                  </Grid>

                  <Modal show={this.state.editMode} handleClose={this.onToggleEditMode}>
                    <StyledInput
                      value={editText}
                      onChange={this.onChangeEditText}
                    />
                    <MeetsyButton onClick={this.onSaveEditText}>Save</MeetsyButton>
                  </Modal>

                  <Modal show={this.state.addMemberMode} handleClose={this.onToggleAddMemberMode}>
                    <StyledInput
                      type="text"
                      value={userEmail}
                      onChange={this.onChangeEditEmail}
                    />
                    <MeetsyButton

                      onClick={() => this.onAddMember(team)}
                    >
                      Add
                    </MeetsyButton>
                  </Modal>

                  {
                    (this.state.team.ownerId !== authUser.uid && team.members.includes(authUser.uid)) ? (
                      <MeetsyButton style={{ width: '130px', marginTop: '10px' }}
                        onClick={() => this.onLeaveTeam(team, authUser.uid)}>
                        Leave Team
                      </MeetsyButton>
                    ) :
                      <span></span>
                  }
                </div>
                )}
              </div>
            )}
            {team && (<div>
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
            </div>)
            }
          </MainContainer>
        )}
      </AuthUserContext.Consumer>
    );
  }
}




const ProfileBox = styled.div`
            display:flex;
            padding: 4px 10px;
            `
const ProfileDescription = styled.div`
            padding: 10px;
            line-height: 0.7;
            `;
const OwnerBox = styled.div`
            font-size: 0.93rem;
            width: 30%;
            background-color: ${COLORS.complementaryDark};
            border-radius: 12px;
            padding: 2% 3%;
            `;
const ProfileCircle = styled.div`
            height: 60px;
            width: 60px;
            border-radius: 50%;
            display: inline-block;
            background-color: rgb(0,89,124);
            `;
const InfoBox = styled.div`
            display:flexbox;
            justify-content:space-between;
            margin-bottom: 5%;
            margin-top: 3%;
            position:relative;
            `;
const TextBox = styled.div`
            width: 65%;
            margin-right: 20px;
            font-size: 0.93rem;
            background-color: ${COLORS.complementaryDark};
            border-radius: 12px;
            padding: 2% 3%;

            `;
const MainContainer = styled.div`
            width: 90%;
            margin: 3%;
            margin-left:auto;
            margin-right:auto;
            height: 100%;
            `;
const TeamPanel = styled.div`
            height: 300px;
            width: 100%;
            border-radius: 22px;
            margin-left:auto;
            position:relative;
            margin-right:auto;
            background: rgb(0,89,124);
            background: linear-gradient(0deg, rgba(0,89,124,1) 0%, rgba(82,182,154,1) 100%);
            `;


export default compose(withFirebase, withRouter)(TeamComponent);