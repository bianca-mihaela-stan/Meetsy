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
      this.db = firebase.firestore();
     
    }
  // *** Auth API ***
   
     
    
    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);
    
  doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
 
    doPasswordUpdate = password =>
         this.auth.currentUser.updatePassword(password);
    // ** Merge Auth and DB User API
    
     // *** User API ***
     get dbUser(){
       this.user(this.auth.currentUser.uid).get().then(query => {
         return query.data();
       }).catch((error) => {
         console.log("No such user!");
       })
     }
     user = uid => this.db.doc(`users/${uid}`);
 
     users = () => this.db.collection('users');

     userByEmail = email => this.db.collection('users').where('email',"==", email.trim());

     // not working - not updating onSnapshot
     usersByTeam = (tid) => this.db.collection('users').where('teams','array-contains-any',[tid]);
     usersByIds = ids => this.db.collection('users').where('userId','in',ids);

    // ** Team API ***

     team = uid => this.db.doc(`teams/${uid}`);
     teams = () => this.db.collection('teams');

}

export default Firebase;