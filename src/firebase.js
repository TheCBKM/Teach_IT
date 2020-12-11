require("firebase/firestore");
import firebase from "firebase";
const firebaseConfig = {
    apiKey: "AIzaSyBlEOLzmMQjr1Mkx7WS9fTV7K7QYYAJVdA",
    authDomain: "teach-it-36a73.firebaseapp.com",
    databaseURL: "https://teach-it-36a73.firebaseio.com",
    projectId: "teach-it-36a73",
    storageBucket: "teach-it-36a73.appspot.com",
    messagingSenderId: "811899075589",
    appId: "1:811899075589:web:74fc08b7e1f2e21666706c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase

var db = firebase.firestore();
export const auth = firebase.auth();
export const firestore = firebase.firestore;
export default db;