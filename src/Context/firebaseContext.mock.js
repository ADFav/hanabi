// import React from "react";
// import app from "firebase/app";
// import auth from "firebase/auth";
// import firestore from "firebase/firestore";

// function initialDeck() {
//     const colors = ['red', 'blue', 'green', 'white', 'yellow'];
//     const numbers = [1, 1, 1, 2, 2, 3, 3, 4, 4, 5];
//     let idNo = 1;
//     const deck = colors.map(color =>
//          numbers.map(number => 
//             ({ id: idNo++, color, number, knowledge: 
//                 { color: false, number: false } }
//                 )
//             )
//         ).flat().sort((a, b) => Math.random() - 0.5);
//     console.log(deck.length);
//     return deck;
// }

// const deck1 = initialDeck();
// const hands = Array(3).fill(0).map(_ => deck1.splice(0, 5));
// const mockDB = {
//     _collections: {
//         users: [
//             { id: 'afav' },
//             { id: 'eshad' },
//             { id: 'jfav' },
//             { id: 'tfav' },
//             { id: 'pfav' }
//         ],
//         games: [{
//             id: 'game_1',
//             players: { afav: true, eshad: true, jfav: true },
//             playOrder: ['afav', 'eshad', 'jfav'],
//             clocks: 8,
//             bombs: 3,
//             reaminingCards: 50 - 15,
//             _collections: {
//                 deck: deck1,
//                 discards: [],
//                 played: [],
//                 'afav-hand': hands[0],
//                 'eshad-hand': hands[1],
//                 'jfav-hand': hands[2]
//             }
//         }]
//     }
// }

// class Firebase {
//     constructor() {
//         app.initializeApp(firebaseConfig);
//         this.auth = app.auth();
//         this.firestore = app.firestore();
//         this.MAX_BATCH_SIZE = 50;
//     }

//     getCollection(collectionPath) {

//     }

//     getDocument(documentPath) {
//         const pathElems = documentPath.split("/");
//         if (pathElems.length % 2 == 1) {
//             throw Error('Invalid document Path');
//         }
//         let document = mockDB;
//         let collection = null;
//         let isCollection = true;
//         pathElems.forEach(pathElem => {
//             if (isCollection) {
//                 const collectionName = pathElem;
//                 collection = document['_collections'][collectionName];
//             } else {
//                 const docId = pathElem;
//                 document = collection.find(doc => doc.id = docId);
//             }
//             isCollection = !isCollection;
//         })
//         return document;
//     }

//     deleteDocument(documentPath) {
//         const pathElems = documentPath.split("/");
//         if (pathElems.length % 2 == 1) {
//             throw Error('Invalid document Path');
//         }
//         let document = mockDB;
//         let collection = null;
//         let isCollection = true;
//         pathElems.forEach(pathElem => {
//             if (isCollection) {
//                 const collectionName = pathElem;
//                 collection = document['_collections'][collectionName];
//             } else {
//                 const docId = pathElem;
//                 document = collection.find(doc => doc.id = docId);
//             }
//             isCollection = !isCollection;
//         })
//         delete document;
//     }

//     docListener(path, callback) {
//         setTimeout(() => {
//             callback(this.getDocument(path));
//         }, 10000);
//     }

//     collectionListener(path, callback) {
//         try {
//             const collection = this.getCollection(path);
//             collection.onSnapshot({
//                 next: snapshot => {
//                     callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//                 },
//                 error: error => {
//                     console.error("Can't connect listener to collection: ", path);
//                     throw error;
//                 }
//             });
//         } catch (e) {
//             console.error("Can't connect listener to collection: ", path);
//             throw e;
//         }
//     }

//     createDoc(collectionPath, document) {
//         try {
//             const collection = this.firestore.collection(collectionPath);
//             return collection.add(document)
//                 .then(reference => {
//                     // console.log(reference.id);
//                     return reference.id;
//                 })
//         } catch (e) {
//             console.error("Can't add document to collection ", collectionPath);
//             console.error(e);
//             throw e;
//         }
//     }

//     updateDoc(documentPath, changes) {
//         try {
//             return this.firestore.doc(documentPath).update(changes);
//         } catch (e) {
//             console.error("Can't update document ", documentPath);
//             console.error(e);
//             throw e;
//         }
//     }

//     writeBatch(collectionPath, documents) {
//         try {
//             const batch = this.firestore.batch();
//             const collection = this.firestore.collection(collectionPath);
//             documents.forEach(document => {
//                 const docId = collection.doc();
//                 batch.set(docId, document);
//             });
//             return batch.commit();
//         } catch (e) {
//             console.error("Can't write batch to collection ", collectionPath);
//             console.error(e);
//             throw e;
//         }
//     }
// }

// const firebaseContext = React.createContext(new Firebase());

// export default Firebase;
// export { firebaseContext };