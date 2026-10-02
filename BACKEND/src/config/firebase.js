const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const config = require("./config.js");

const firebaseApp = initializeApp({
  credential: cert({
    projectId: config.FIREBASE_PROJECT_ID,
    clientEmail: config.FIREBASE_CLIENT_EMAIL,
    privateKey: config.FIREBASE_PRIVATE_KEY,
  }),
});

const adminAuth = getAuth(firebaseApp);

module.exports = adminAuth;