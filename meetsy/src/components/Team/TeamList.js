import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import Team from './Team';

class TeamList extends Component {
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
  // avem optiunea de a crea o echipa direct de pe pagina de listare
  // a echipelor - de aceea trebuie ca metoda de create sa fie definita
  // aici, ci nu in Team
  onCreateTeam = (event, authUser) => {
    event.preventDefault();
    this.props.firebase.teams().add({
      name: this.state.name,
      ownerId: authUser.uid,
      members: [authUser.uid]
    }).then((doc) => {
     
      this.props.firebase.user(authUser.uid).get().then(query => {
      const newTeams = query.data().teams;
      newTeams.push(doc.id);
      this.props.firebase.user(authUser.uid).update({
        teams: newTeams
      })
      this.setState({ name: '' });
      })
    })
      .catch((error) => {
        console.error("Error creating team: ", error);
      });
     
  };

  render() {
    const { name, teams, loading } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <h2>Teams</h2>
            {/* afisam mesajul de loading cat timp informatiile se incarca
        din bd */}
            {loading && <div>Loading ...</div>}
            {teams && (
              <ul> {
                //  pentru fiecare echipa afisam o componenta corezpunzatoare
                // de tipul Team
                teams.map(team => (
                  <Team
                    authUser={authUser}
                    key={teams.uid}
                    team={team}
                  />
                ))}
              </ul>
            )}

            {/*onCreateTeam trebuie sa primeasca si event ca sa putem
          preveni actiunea default a submisiei  */}
            <form
              onSubmit={event =>
                this.onCreateTeam(event, authUser)
              }
            >
              <input
                type="text"
                value={name}
                onChange={this.onChangeText}
              />
              <button type="submit">Create Team</button>
            </form> </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}
// folosim withFirebase pentru a putea accesa data de baza
// prin intermediul atributului this.props.firebase
export default withFirebase(TeamList);