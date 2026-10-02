
const adminAuth = require("../config/firebase.js");
const userModel = require("../models/user.model.js");
const logger = require("../utils/logger.js");

async function authUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
   const decodedToken = await adminAuth.verifyIdToken(idToken);
    let user = await userModel.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      user = await userModel.create({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name || decodedToken.email,
        photoURL: decodedToken.picture,
      });
    }

    req.user = user;
    next();
  }  catch (err) {
    logger.warn({ err: err.message }, "Firebase token verification failed");
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

module.exports = {
  authUser,
};
