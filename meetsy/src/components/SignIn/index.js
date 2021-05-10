import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { PasswordForgetLink } from '../PasswordForget'; 
import { StyleSheet, css } from 'aphrodite';
import  styled  from "styled-components";


const SignInLink = () => (
  <p>
    Already have an account? <Link to={ROUTES.SIGN_IN}>Sign In</Link>
  </p>
);

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
       color: #fff !important;
     }
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

const SignInPage = () => (
    <Container>
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />
    </Container>
);
 
const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};
 
class SignInFormBase extends Component {
  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };
  }
 
  onSubmit = event => {
    const { email, password } = this.state;
 
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
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
    const { email, password, error } = this.state;
 
    const isInvalid = password === '' || email === '';
 
    return (
      <form style={form} onSubmit={this.onSubmit}>
      <h3 style={heading}>Sign in</h3>
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
          name="password"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        /></div>
         <StyledButton  disabled={isInvalid} type="submit">
          Sign In
          </StyledButton >
 
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}
 
const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);
 
export default SignInPage;
 
export { SignInForm, SignInLink };