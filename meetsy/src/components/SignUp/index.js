import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { StyleSheet, css } from 'aphrodite';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { compose } from 'recompose';
import  styled  from "styled-components";
import { SignInLink } from '../SignIn';

const heading = {
           marginBottom: '2rem',
           alignSelf: 'center'
     };
const form = {
  marginTop: '10%',
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignContent: 'center',
  justifyContent: 'center',
  boxSizing: 'initial'
 };
const StyledButton  =  styled.button`
  width: 75%;
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

const SignUpPage = () => (
  <Container>
    <SignUpForm />
    <div>
        <Terms>
            By signing up, I agree to the Privacy Policy <br/>and Terms of Service.
        </Terms>
      </div>
      <SignInLink/>
      </Container>
);
const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase
          .user(authUser.user.uid)
          .set({
            username,
            email,
            userId: authUser.user.uid,
            teams: []
          },
          {merge: true});
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
      <form style={form} onSubmit={this.onSubmit}>
        <h3 style={heading}>Sign up</h3>
        <div style={inputCtn}>
        <StyledInput
          name="username"
          value={username}
          onChange={this.onChange}
          type="text"
          placeholder="Full Name"
        /></div>
        <div style={inputCtn}>
        <StyledInput
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        /></div>
        <div style={inputCtn}>
        <StyledInput
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        /></div>
        <div style={inputCtn}>
        <StyledInput
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm Password"
        /></div>
        <StyledButton  disabled={isInvalid} type="submit">
          Sign Up
        </StyledButton >

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}
const Container = styled.div`
     h4 {
        font-size: 14px;
        color: white;
        marginTop: 2rem;
     }
     display: flex;
     flex-direction: column;
     align-items: center;
     p 
     {
       color: #fff;
     }
`;
const Terms = styled.p` 
   padding: 0 1rem;
   text-align: center;
   font-size: 11px;
   color: #fff;
   font-weight: 300;
`;
const StyledInput = styled.input`
 width: 80%;
 max-width: 350px;
 min-width: 250px;
 height: 40px;
 border: none;
 margin: 0.5rem 0;
 background-color: #f5f5f5;
 box-shadow:  0px 14px 9px -15px rgba(0,0,0,0.25);
 border-radius: 32px;
 padding:  0 1rem;
 color: #393c41;
 &:hover{
  outline-width: 0;
 }
 &:focus{
  outline-width: 0;
  // border: 3px solid rgb(62,106,225,0.7);
 }
`;
const StyledContainer = styled.div`
display:flex;
flex-direction: column;
align-items: center;
justify-content:center;
width: 100%;
height: 100%;
padding: 0;
margin: 0;
`;
const inputCtn = {
   display: 'flex',
   justifyContent: 'center',
   alignContent: 'center'
};
const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);
const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };