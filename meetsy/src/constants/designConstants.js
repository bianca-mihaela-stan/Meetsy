import styled from 'styled-components';

export const COLORS = {
  body: 'white',
  bodyLight: '#f4f4f4',
  primaryBlue: '#3e6ae1',
  primaryBg: '#131516',
  inputGrey: '#393c41',
  error: '#e60000',
  success: '#00e600'
}

export const errorMsg = {
  textAlign: 'center',
  paddingTop: '1pc',
  paddingBottom: '1pc',
  color: COLORS.error,
  textWeight: 'bold'
};

export const successMsg = {
  textAlign: 'center',
  paddingTop: '1pc',
  paddingBottom: '1pc',
  color: COLORS.success,
  textWeight: 'bold'
};

export const StyledButton = styled.button`
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

export const StyledInput = styled.input`
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

export const StyledTextArea = styled.textarea`
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

export const form = {
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
  maxWidth: '500px',
  flexDirection: 'column',
  alignContent: 'center',
  justifyContent: 'right',
  boxSizing: 'initial'
};

export const StyledCheckbox = styled.input`
 width: 18px;
 height: 18px;
 margin-left:auto !important;
 margin-right:auto !important;
 margin: 0.5rem 0;
`;
