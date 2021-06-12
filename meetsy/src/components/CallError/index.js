import React from 'react';
import { Component } from 'react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import {compose} from 'recompose';
import { COLORS } from '../../constants/designConstants';
import styled from 'styled-components';
import {withRouter} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
class Error extends Component {
  constructor(props){
    super(props);
   
  }
 
  render() {

    return (
    
      <div style={{position:'relative', marginLeft: 'auto', marginRight: 'auto', marginTop:'auto', marginBottom: 'auto'}}>
      <h1>Error 101  - Hey, you little troublemaker...</h1>
      <p>Seems like you are already in that call. Press the button below to return home.
      </p>
      <StyledButton onClick = {() => this.props.history.push(ROUTES.HOME)}>Home</StyledButton>

     
    </div>
   
    )
  }
}

const StyledButton = styled.button`
  margin-left:auto;
  margin-right:auto;
  max-width: 250px;
  min-width: 150px;
  height: 40px;
  border: none;
  margin: 1rem 0;
  box-shadow: 0px 14px 9 px -15px rgba(0,0,0,0.25);
  border-radius: 32px;
  background-color: ${COLORS.primaryBlue};
  color: white;
  font-weight: 600;
  cursor: pointer;
  align-self: center;
  &:hover {
    background-color: ${COLORS.primaryBlue};
  }
`;
const condition = authUser => !!authUser;
export default compose(withRouter, withAuthorization(condition))(Error);