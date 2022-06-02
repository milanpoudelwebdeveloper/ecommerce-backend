const admin = require("../firebase/index");
const User = require("../models/user");

exports.authCheck = async (req, res, next) => {
  console.log("here the request header", req);
  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);

    //after succesfully getting user after verifying the token using firebase admin, we are assigning req with
    //req.user with firebaseUser to make it available for another next function
    req.user = firebaseUser;
  } catch (e) {
    console.log("This is not valid token");
    res.status(401).json({
      err: "Invalid or expired token",
    });
  }
  return next(); // this contains token
};

//checking whether the user is admin or not
exports.adminCheck = async (req, res, next) => {
  console.log("Request user is", req.user);
  const { email } = req.user;
  const adminUser = await User.findOne({ email: email }).exec();
  console.log("admin user is", adminUser);
  if (adminUser.role !== "admin") {
    return res.status(403).json({
      error: "Admin resource , Access denied",
    });
  } else {
    next();
  }
};
