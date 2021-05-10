import React from 'react'
import styled from 'styled-components';
// shortcut: rafce

const SidebarLanding = () => {
    return (
        <Container>
          <LogoWrapper>
              <h3>
                  Meet<span>sy</span></h3>
          </LogoWrapper>
        </Container>
    )
}
const LogoWrapper = styled.div`
  h3 
  {
      text-align: center;
      color: white;
      font-size: 22px;

  }
  span
  {
     color:  #3e6ae1;     
     font-weight: 300;
     font-size:20px; 
  }
`;
const Container = styled.div`
min-width: 400px;
// backdrop-filter: blur(35px);
// background-color: rgba(255,255,255,0.35);
background-color: rgba(0,0,0,1);
height: 100%;
display: flex;
justify-content: space-evenly;
flex-direction; column;
align-items: center;
padding: 0 2 rem;
@media(max-width: 900px)
{
    width: 100vw;
    position:absolute;
    padding: 0;
}
`;
export default SidebarLanding;
