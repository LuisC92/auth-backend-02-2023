const { hashPassword } = require("../helpers/password");
const Users = require("../models/users.model");

const createUser = (req, res) => {
  const { email, password } = req.body;
  //* hash the password
  // console.log(password)
  hashPassword(password).then((hashedPassword) => {
    // console.log(hashPassword)
    const user = {
      email: email,
      hashedPassword: hashedPassword,
    };
    //* use the model to create a new user
    Users.create(user)
      .then((results) => {
        res.status(201).json({
          user: email,
          message: `The user ${email} has been created`,
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("can't create user");
      });
  });
};

module.exports = {
  createUser,
};
