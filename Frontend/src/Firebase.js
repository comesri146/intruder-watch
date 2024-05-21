import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDLYtzWJJBV9xmX0uhZc2dFOlBoKGTR4PE",
    authDomain: "react-auth-7fdad.firebaseapp.com",
    projectId: "react-auth-7fdad",
    storageBucket: "react-auth-7fdad.appspot.com",
    messagingSenderId: "68984788570",
    appId: "1:68984788570:web:e2c67ce0c301a113c92a63",
    measurementId: "G-6N4X34GRLW"
};
  
firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var provider = new firebase.auth.GoogleAuthProvider(); 
export {auth , provider};
export default firebase;