import React from "react";
import app from "firebase/app";
import auth from "firebase/auth";
import firestore from "firebase/firestore";
import * as firebaseui from 'firebaseui'


const firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    databaseURL: process.env.REACT_APP_DATABASEURL,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_APPID
};



class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig);
        this.auth = app.auth();
        this.firestore = app.firestore();
        this.MAX_BATCH_SIZE = 50;
        this.googleAuthProvider = app.auth.GoogleAuthProvider;
    }

    loginWithGoogle() {
        const provider = new app.auth.FacebookAuthProvider()
        console.log(provider);
        // this.auth.signIn
        // this.auth.signInWithEmailAndPassword('ellen.shadburn@gmail.com', 'abc123456efg').then(console.log).catch(console.error);
        app.auth().signInWithRedirect(provider).then(userCredential => {
            console.log(userCredential);
        }).catch(err => {
            console.error(err);
        });
    }

    signUpWithEmail(email, password, displayName) {
        this.auth.onAuthStateChanged(change => {
            if(change){
                change.updateProfile({ displayName });
            }
        })
        this.auth.createUserWithEmailAndPassword(email, password).then(user => {
            console.log("User created!");
        }).catch(err => {
            console.error(err);
        });
    }

    loginWithEmail(email, password){
        this.auth.signInWithEmailAndPassword(email, password).then(user =>{
            console.log(user);
            console.log("Signed in!");
        }).catch(err =>{
            console.error(err);
        });
    }

    registerAuthListener(callback) {
        this.auth.onAuthStateChanged(callback);
    }
    logout() {
        this.auth.signOut();
    }


    getCollection(collectionPath) {
        try {
            return this.firestore.collection(collectionPath);
        } catch (e) {
            console.error("Issue with collection path: ", collectionPath);
            throw e;
        }
    }

    getDocument(documentPath) {
        return this.firestore.doc(documentPath);
    }

    deleteDocument(documentPath) {
        return this.firestore.doc(documentPath).delete()
    }

    docListener(path, callback) {
        this.getDocument(path).onSnapshot({
            next: snapshot => {
                callback({ id: snapshot.id, ...snapshot.data() });
            },
            error: error => {
                throw error;
            }
        });
    }

    collectionListener(path, callback) {
        try {
            const collection = this.getCollection(path);
            collection.onSnapshot({
                next: snapshot => {
                    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                },
                error: error => {
                    console.error("Can't connect listener to collection: ", path);
                    throw error;
                }
            });
        } catch (e) {
            console.error("Can't connect listener to collection: ", path);
            throw e;
        }
    }

    createDoc(collectionPath, document) {
        try {
            const collection = this.firestore.collection(collectionPath);
            return collection.add(document)
                .then(reference => {
                    // console.log(reference.id);
                    return reference.id;
                })
        } catch (e) {
            console.error("Can't add document to collection ", collectionPath);
            console.error(e);
            throw e;
        }
    }

    query(collectionPath, queries, callback) {
        try {
            const queryReducer = (collection, query) => collection.where(query.field, query.operator, query.value)
            const queryResult = queries.reduce(queryReducer, this.getCollection(collectionPath));
            queryResult.onSnapshot({
                next: snapshot => {
                    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                },
                error: error => {
                    console.error("Can't connect listener to collection: ", collectionPath);
                    throw error;
                }
            });
        } catch (e) {
            console.error("Can't connect listener to collection: ", collectionPath);
            throw e;
        }
    }

    updateDoc(documentPath, changes) {
        try {
            return this.firestore.doc(documentPath).update(changes);
        } catch (e) {
            console.error("Can't update document ", documentPath);
            console.error(e);
            throw e;
        }
    }

    writeBatch(collectionPath, documents) {
        try {
            const batch = this.firestore.batch();
            const collection = this.firestore.collection(collectionPath);
            documents.forEach(document => {
                const docId = collection.doc();
                batch.set(docId, document);
            });
            return batch.commit();
        } catch (e) {
            console.error("Can't write batch to collection ", collectionPath);
            console.error(e);
            throw e;
        }
    }
}

const firebaseContext = React.createContext(new Firebase());

export default Firebase;
export { firebaseContext };