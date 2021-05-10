import React from 'react';
import styled from 'styled-components';
import bgImg from '../../assets/bg2.jpg';
import MainLanding from './MainLanding';
import SidebarLanding from './SidebarLanding';
const Landing = () => (
  <div>
    <Container>
      <Wrapper>
       <SidebarLanding></SidebarLanding>
       <MainLanding></MainLanding>
      </Wrapper>
    </Container>
  </div>
);
const Container = styled.div`
background: #eefcff;
position: absolute;
top:0;
left: 0;
bottom:0;
right:0;
`;
const Wrapper = styled.div`
  background-image: url(${bgImg});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  display: flex;
`;
export default Landing;