import React, { Component } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import { AuthUserContext } from '../Session';
import { withRouter } from "react-router";
import { compose } from 'recompose';
import styled from 'styled-components';
import { css } from 'react-loading-screen/node_modules/styled-components';
import { Column, Row } from 'simple-flexbox';
import Grid from "@material-ui/core/Grid";
import { Button } from 'bootstrap';
import { COLORS } from '../../constants/designConstants';
import Modal from '../Modal';
import { StyleSheet } from 'aphrodite';
import IconDelete from '../../assets/icon-delete';
import IconEdit from '../../assets/icon-edit';
import IconBack from '../../assets/icon-back';
import IconAdd from '../../assets/icon-add';
import * as ROUTES from '../../constants/routes';
import {StyledInput, addButton, buttonAction, ButtonGroup, backButton, MeetsyButton, StyledButton} from '../../styles';




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
      loadingOwner: false,
      owner: null
    };
    console.log(props);

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
        }
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
          loading: false
        });

        if(this.state.team.ownerId) {
          this.setState({owner: members.filter(u => u.userId === this.state.team.ownerId)[0]}, () => {console.log(this.state.owner)});
        }
        
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
          newTeams.push(team.uid);
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


  render() {
    const { editMode, editText, members, loading, addMemberMode, userEmail, team, loadingTeam, condition } = this.state;
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
              <Link to={ROUTES.SHOW_TEAMS} style={{...buttonAction,...backButton}}><IconBack></IconBack></Link>
              <TextBox> <h5 >About this course</h5>
                {team && team.description ? <p>{team.description}</p> : <p style={{ marginBottom: '0', textAlign: 'justify', color: '#E0E0E0' }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.</p>}
              </TextBox>
              <OwnerBox>
                <h5>Instructor</h5>
                {team && team.ownerId && this.state.owner &&  (<Row>
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
                  <h5 style={{display: 'inline'}}>Members</h5> {condition(authUser.uid) && (
                     <button style={{...buttonAction,...addButton}} onClick={this.onToggleAddMemberMode}><IconAdd></IconAdd></button>
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

                  <Modal show={this.state.addMemberMode} handleClose = {this.onToggleAddMemberMode}>
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
                    (this.state.team.ownerId!== authUser.uid && team.members.includes(authUser.uid)) ? (
                      <MeetsyButton style={{width: '130px', marginTop: '10px'}}
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