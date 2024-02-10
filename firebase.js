// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAy7toM_FeutOSHFnuBxmagiHZGc88__z0",
  authDomain: "commuride-9dce8.firebaseapp.com",
  projectId: "commuride-9dce8",
  storageBucket: "commuride-9dce8.appspot.com",
  messagingSenderId: "881816098737",
  appId: "1:881816098737:web:12c758a184862f86018f90"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
    app = firebase.app(firebaseConfig)
} else {
    app = firebase.app()
}
const auth = firebase.auth()

export {auth};
