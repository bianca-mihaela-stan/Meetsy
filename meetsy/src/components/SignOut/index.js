import React from 'react';

import { StyleSheet, css } from 'aphrodite';
import { withFirebase } from '../Firebase';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import IconSignOut from '../../assets/icon-sign-out.js';

const icon = {
  height: '23px',
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  outline: 'none'
};

const link = {
  textAlign: 'center'
};


const SignOutButton = ({ firebase }) => (
    <button style={icon} type="button" onClick={firebase.doSignOut}>
        <IconSignOut color='white'/>
    </button>
);

export default withFirebase(SignOutButton);