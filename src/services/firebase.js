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
if (firebase.apps.length === 0) firebase.initializeApp(config);

export const getDocument = function (c, d) {
    return db.collection(c).doc(d).get();
}

export const getCollection = (c) => {
    return db.collection(c).get();
}

export  const setDocument =  (c, d, obj) => {
    const docRef = db.collection(c).doc(d);
    return docRef.set(obj);
}

export const addDocument = (c, obj) => {
    const colRef = db.collection(c);
    return colRef.add(obj);
}

export const updateDocument = (c, d, obj) => {
    return db.collection(c).doc(d).update(obj);
}


export const auth = firebase.auth();
export const db = firebase.firestore();