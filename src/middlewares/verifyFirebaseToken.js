const { FIREBASE_ADMIN_CREDENTIALS } = require("../constants");
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(FIREBASE_ADMIN_CREDENTIALS)),
});

const verifyFirebaseToken = async (token) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;
    return userId;
  } catch (error) {
    console.error("Google token verification error: " + error);
    throw new Error("Invalid token");
  }
};

module.exports = verifyFirebaseToken;
