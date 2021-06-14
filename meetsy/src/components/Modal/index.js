import React, { useState } from 'react';
import { Column } from 'simple-flexbox';
import styled from 'styled-components';
import { COLORS } from '../../constants/designConstants';

const ModalMain = styled.div`
    position:fixed;
    background-color: ${COLORS.complementaryDark};
    width: 500px;
    height: 370px;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
`;
  
const StyledModal = styled.div` 
    position: fixed;
    top: 0;
    left: 0;
    width:100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
  }
`;

const Modal = ({ handleClose, show, children }) => {
    const showHideClassName = show ? {display: "block"} : {display: "none"};
    
    return (
      <StyledModal style = {showHideClassName}>
        <ModalMain>
          {children}
          <button type="button" onClick={handleClose}>
            Close
          </button>
          </ModalMain>
        </StyledModal>
    );
  };

export default Modal;