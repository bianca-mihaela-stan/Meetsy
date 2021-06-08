// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import 'firebase/database';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBBX0xA53I5ImapDNmlHZjBvUJjdUQCNL0",
    authDomain: "meetsy-f287c.firebaseapp.com",
    projectId: "meetsy-f287c",
    storageBucket: "meetsy-f287c.appspot.com",
    messagingSenderId: "1062287763930",
    appId: "1:1062287763930:web:030fadcbd80694393938e3",
    measurementId: "G-NQJFWHR5GY"
  };

// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);


class Firebase {
    constructor() {
      firebase.initializeApp(firebaseConfig);

      this.auth = firebase.auth();
      this.db = firebase.database();
    }
  

  // *** Auth API ***
 
    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);
    
  doSignOut = () => {
    this.auth.signOut();
    window.location.reload();
  }

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
 
    doPasswordUpdate = password =>
         this.auth.currentUser.updatePassword(password);
   
     // *** User API ***
 
    user = uid => this.db.ref(`users/${uid}`);
 
    users = () => this.db.ref('users');
}

export default Firebase;