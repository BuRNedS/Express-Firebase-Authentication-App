const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('./path/to/your/serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const LogInCollection = db.collection('LogInCollection');

const createUser = async (data) => {
  try {
    await LogInCollection.doc(data.name).set(data);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

const findUserByName = async (name) => {
  try {
    const userDoc = await LogInCollection.doc(name).get();
    return userDoc.exists ? userDoc.data() : null;
  } catch (e) {
    console.error("Error getting document: ", e);
  }
};

module.exports = { createUser, findUserByName };
