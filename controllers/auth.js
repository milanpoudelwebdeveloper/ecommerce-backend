const User = require("../models/user");

exports.createOrUpdateUser = async (req, res) => {
  const { name, picture, email } = req.user;

  //here the first one argument is by what are we trying to find and then second argument is what we are trying to update
  const user = await User.findOneAndUpdate(
    {
      email: email,
    },
    {
      name: name,
      picture: picture,
    },
    {
      //here new:true helps to update and retun recently updated info
      new: true,
    }
  );
  //if we found the user, we will send json response
  if (user) {
    res.json(user);
  }
  //otherwise if there is no user existing in that database then we will create new user in the database
  else {
    const newUser = await new User({
      email: email,
      name: name,
      picture: picture,
    }).save();
    res.json(newUser);
  }
};

//we get req.user here from authCheck middleware
exports.getCurrentUser = async (req, res) => {
  User.findOne({ email: req.user.email }).exec((err, user) => {
    if (err) {
      throw new Error(err);
    } else {
      res.json(user);
    }
  });
};
