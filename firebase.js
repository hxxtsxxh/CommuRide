// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "firebase api key here",
    authDomain: "commuride-9dce8.firebaseapp.com",
    projectId: "commuride-9dce8",
    storageBucket: "commuride-9dce8.appspot.com",
    messagingSenderId: "881816098737",
    appId: "1:881816098737:web:12c758a184862f86018f90"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app()
}

const auth = firebase.auth()
export {auth};
