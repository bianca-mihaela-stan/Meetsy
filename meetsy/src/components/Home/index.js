import React from 'react';
import { Component } from 'react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import {compose} from 'recompose';
import styled from "styled-components";
import bgImg from "../../assets/bg6.jpg";
import imgpng from "../../assets/elearning.png";
import { Row, Column } from 'simple-flexbox';
import {COLORS} from "../../constants/designConstants";
class Home extends Component {
  constructor(props){
    super(props);
  }
 
  render() {

    return (
      <div>
      
      <Container>
        <MainContainer>
          <h3>Welcome back, {this.props.firebase.authUser.username}</h3>
          <FirstFrame>
            <InnerFirstFrame>
              <h4>Always reach higher</h4>
              <p>Never stop chasing those dreams. Lorem ipsum lorem ipsum lorem ipsum <br/> 
              lorem ipsum lorem ipsum.</p>
            <StyledButton>Explore</StyledButton></InnerFirstFrame></FirstFrame>
            <RowFrame>
            <Frame style={{backgroundColor: '#11917a', backgroundImage: `${imgpng}` }}>
            </Frame>
            <Frame style={{backgroundColor: '#11917a'}}>
            </Frame>
            <Frame>
              <p style={{fontSize: '200px', marginLeft:'auto', marginRight: 'auto', height: '50%'}}>14</p>
              <p>June, 2021</p>
              </Frame>
            </RowFrame> 

        </MainContainer>
     
      <SideFrame>
        <h5 style ={{color: 'black', textAlign: 'center', marginTop: '5px'}}>Discover courses</h5>
        <InnerSideFrame>
          
        </InnerSideFrame>
        </SideFrame>
      </Container>
    </div>
    )
  }
}


const InnerSideFrame = styled.div`
width:100%;
height: 50%;
background-color: #EDEDED;
border-radius: 32px;
`;
const RowFrame = styled.div`display:flex;height:auto;`;
const Frame = styled.div`
display:flex;
border-radius:32px;
height: 260px;
margin: 10px 0;
margin-right: 10px;
min-width: 300px;
max-width: 400px;
`
const InnerFirstFrame = styled.div`
  display:flex;
  flex-direction:column;
  padding-left: 10%;
`;
const StyledButton = styled.button`
  max-width: 150px;
  min-width: 100px;
  height: 40px;
  border: none;
  margin: 1rem 0;
  box-shadow: 0px 14px 9 px -15px rgba(0,0,0,0.25);
  border-radius: 32px;
  background-color: ${COLORS.primaryBg};
  color: white;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background-color: #0087e0;
  }
`;
const MainContainer = styled.div`
width:100%;height:100%;
`;
const Container = styled.div`
display:flex;
width: 100%;
height: 100%;
justify-content: space-between;
`;
const SideFrame = styled.div`
width: 30%;
height: 80vh;
margin-top: 3%;
background-color: white;
border-radius: 32px;
display: flex;
padding: 15px;
flex-direction: column;
`;
const FirstFrame = styled.div` 
 margin-top: 3%;
 width: 90%;
 height: 300px;
 background-color: #F78888;
 border-radius: 32px;
 display:flex;
 align-items: center;
`;
const condition = authUser => !!authUser;
export default compose (withFirebase, withAuthorization(condition))(Home);