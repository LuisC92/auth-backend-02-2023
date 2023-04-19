const Users = require("../models/users.model");

const createNewUser = (req, res, next) => {
  const { email } = req.body;

  //* get from DB if email already exists
  Users.findOneEmail(email)
    .then((results) => {
      if (!results[0]) {
        next();
      } else {
        res.status(409).send("This email address already exists");
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("can't create user");
    });
};

module.exports = {
  createNewUser,
};
