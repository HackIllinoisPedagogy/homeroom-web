import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyBaaNEt16iY6FuP2RZHiwo5BC5sY3gYf-A",
    authDomain: "pasdkvafvwdvj-hackilli.firebaseapp.com",
    databaseURL: "https://pasdkvafvwdvj-hackilli.firebaseio.com",
    projectId: "pasdkvafvwdvj-hackilli",
    storageBucket: "pasdkvafvwdvj-hackilli.appspot.com",
    messagingSenderId: "252438045046",
    appId: "1:252438045046:web:7eacef176c207f50151a57"
};
if(firebase.apps.length === 0) firebase.initializeApp(config);
export const auth = firebase.auth();
export const db = firebase.firestore();