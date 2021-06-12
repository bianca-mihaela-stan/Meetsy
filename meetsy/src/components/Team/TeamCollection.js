import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import TeamItem from './TeamItem';
import Grid from "@material-ui/core/Grid";
import styled from 'styled-components';
import { COLORS } from '../../constants/designConstants';
import ReactModal from 'react-modal';
import Modal from 'react-modal';
import Popup from 'reactjs-popup';

class TeamCollection extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    // state reprezinta un obiect care mentine informatie care e posibil sa se schimbe
    // pe parcursul vietii componentei si este de obiecei schimbata de event handlers

    // in cazul de fata ne intereseaza sa  tinem evidenta noului nume al echipei (name),
    // daca contentul s-a incarcat din db (loading) si asupra echipelor citite (teams)
    this.state = {
      name: '',
      loading: false,
      teams: [],
      description: '',
      modalIsOpen: false
    };
  }
  // este chemata imediata ce componenta este mounted (este adaugata in DOM)
  componentDidMount() {
    this.onListenForMessages();
  }

  onListenForMessages = () => {
    this.setState({ loading: true });

    ///onSnapshot - An initial call using the callback you provide creates a document snapshot
    // immediately with the current contents of the single document. Then, each time 
    // the contents change, another call updates the document snapshot.
    this.unsubscribe = this.props.firebase
      .teams()
      .onSnapshot(snapshot => {
        let teams = [];
        console.log("here!");
        snapshot.forEach(doc =>
          teams.push({ ...doc.data(), uid: doc.id }),
        );

        this.setState({
          teams,
          loading: false,
        });
      });
  }
  // ATENTIE!!!: onSnapshot nu returneaza un promise!
  // Explicatie: A Promise in JavaScript can resolve (or reject) exactly once. A onSnapshot on the other
  // hand can give results multiple times. That's why onSnapshot doesn't return a promise.
  // Note: When you are no longer interested in listening to your data, you must detach your listener
  // so that your event callbacks stop getting called. 

  // functia o sa fie chemata imediat inainte ca componenta sa fie eliminata din DOM
  componentWillUnmount() {
    // apelam metoda asta ca sa incetam sa ascultam schimbarile colectiei din bd
    this.unsubscribe();
  }
  
  /// ATENTIE! Trebuie sa actualizam valoarea inputului
  onChangeText = event => {
    this.setState({ name: event.target.value });
  };
  onChangeDescription = event => {
      this.setState({description: event.target.value});
  }
  // avem optiunea de a crea o echipa direct de pe pagina de listare
  // a echipelor - de aceea trebuie ca metoda de create sa fie definita
  // aici, ci nu in Team
  onCreateTeam = (event, authUser) => {
    event.preventDefault();
    this.props.firebase.teams().add({
      name: this.state.name,
      ownerId: authUser.uid,
      members: [authUser.uid],
      description: this.state.description
    }).then((doc) => {
     
      this.props.firebase.user(authUser.uid).get().then(query => {
      const newTeams = query.data().teams;
      newTeams.push(doc.id);
      this.props.firebase.user(authUser.uid).update({
        teams: newTeams
      })
      this.setState({ name: '' , description: ''});
      this.setState()
      })
    })
      .catch((error) => {
        console.error("Error creating team: ", error);
      });
     
  };
  /// FOR MODAL
  openModal = () => { this.setState({modalIsOpen: true});}

  closeModal = () => { this.setState({modalIsOpen: false}); }

  render() {
    const { name, teams, loading, description } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <h2>Teams</h2>
            {/* afisam mesajul de loading cat timp informatiile se incarca
        din bd */}
            {loading && <div>Loading ...</div>}

            {teams && (
                <Grid container spacing={1}>
               {
                //  pentru fiecare echipa afisam o componenta corezpunzatoare
                // de tipul Team
                teams.map(team => (
                    <Grid item xs={12} sm={6} md={3}>
                    <TeamItem
                    authUser={authUser}
                    team = {team}
                  />
                  </Grid>
                ))}
              </Grid>
            )}

            {/*onCreateTeam trebuie sa primeasca si event ca sa putem
          preveni actiunea default a submisiei  */}
      

           {/* <Popup
    trigger={<button> Open Modal </button>}
    modal
  >
    {close => ( */}
      <form style={form}
      onSubmit={event =>
        this.onCreateTeam(event, authUser)
      }
    >
      <h4 style={{'marginBottom': '10px'}}>Create a new course</h4>
      <StyledInput
        type="text"
        value={name}
        placeholder = 'Name'
        onChange={this.onChangeText}
      />
      <StyledTextArea
        type="text"
        value={description}
        placeholder = 'Description'
        onChange={this.onChangeDescription}
      />
      <StyledButton type="submit">Create Team</StyledButton>
      
      {/* <button
            className="button"
            onClick={() => {
              console.log('modal closed ');
              close();
            }}
          >
            close modal
          </button> */}
    </form>
    {/* )}
  </Popup> */}
             </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}
const StyledButton  =  styled.button`
  max-width: 350px;
  min-width: 250px;
  height: 40px;
  border: none;
  margin: 1rem 0;
  box-shadow: 0px 14px 9 px -15px rgba(0,0,0,0.25);
  border-radius: 32px;
  background-color: #3e6ae1;
  color: white;
  font-weight: 600;
  cursor: pointer;
  align-self: center;
  &:hover {
    background-color: #3457b1;
  }
`;
const StyledInput = styled.input`
 width: 450px;
 margin-left:auto !important;
 margin-right:auto !important;

 height: 40px;
 border: none;
 margin: 0.5rem 0;
 color: #393c41 !important;
 background-color: #f5f5f5;
 box-shadow:  0px 14px 9px -15px rgba(0,0,0,0.25);
 border-radius: 32px;
 padding:  0 1rem;
 &:hover{
  outline-width: 0;
 }
 &:focus{
  outline-width: 0;
  // border: 3px solid rgb(62,106,225,0.7);
 }
`;
const StyledTextArea = styled.textarea`
 width: 450px;
 margin-right:auto !important;
 margin-left:auto !important;
 height: 100px;
 border: none;
 margin: 0.5rem 0;
 color: #393c41 !important;
 background-color: #f5f5f5;
 box-shadow:  0px 14px 9px -15px rgba(0,0,0,0.25);
 border-radius: 8px;
 padding:  1rem 1rem;
 &:hover{
  outline-width: 0;
 }
 &:focus{
  outline-width: 0;
  // border: 3px solid rgb(62,106,225,0.7);
 }
`;

const form = {
    marginTop: '10%',
    marginRight: 'auto !important',
    marginLeft: 'auto !important',
    padding: '5%',
    //#13d3df #5577f2
    backgroundColor: '#53a7e1',
    boxSizing: 'border-box',
    display: 'flex',
    borderRadius: '8px',
    minWidth: '300px',
    maxWidth: '600px',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'right',
    boxSizing: 'initial'
   };
// folosim withFirebase pentru a putea accesa data de baza
// prin intermediul atributului this.props.firebase
export default withFirebase(TeamCollection);