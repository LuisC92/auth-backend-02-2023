const { hashPassword, verifyPassword } = require("../helpers/password");
const Users = require("../models/users.model");
const jwt = require("jsonwebtoken");
const randomString = require("randomstring");

const { sendEmail } = require("../helpers/sendEmail");

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

const login = (req, res) => {
  // console.log(req.body)
  // console.log(req.user)
  const { email, password } = req.body;
  const { id, hashedPassword } = req.user;
  //* verify the password
  verifyPassword(hashedPassword, password)
    .then((result) => {
      //* create a jwt token
      if (result) {
        const token = jwt.sign(
          { userId: id, email: email },
          process.env.PRIVATE_KEY
        );
        res
          .status(200)
          .cookie("user_token", token, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
          })
          .send({
            email: email,
            token: token,
          });
      } else {
        res.status(403).send("Invalid password");
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("can't login with this password");
    });
};

const changePassword = (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { userId, email } = req.payload;

  // console.log(currentPassword)
  // console.log(newPassword)
  // console.log(userId)

  Users.findOneEmail(email)
    .then((results) => {
      if (results[0]) {
        verifyPassword(results[0].hashedPassword, currentPassword)
          .then((verification) => {
            if (verification) {
              delete results[0].hashedPassword;
              if (currentPassword !== newPassword) {
                hashPassword(newPassword).then((hashPassword) => {
                  // console.log(hashPassword)

                  Users.changePassword(email, hashPassword)
                    .then((results) => {
                      if (results.affectedRows > 0) {
                        res.status(200).send("Your password has been changed");
                      }
                    })
                    .catch((error) => {
                      console.error(error);
                      res.status(500).send("can't change the password");
                    });
                });
              } else {
                res
                  .status(401)
                  .send(
                    "Your new password can't be the same as your old password"
                  );
              }
            } else {
              res.status(401).send("Your current password doesn't match");
            }
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Invalid password");
          });
      } else {
        res.status(401).send("This email address does not exist");
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("can't found the email");
    });
};

const forgetPassword = (req, res) => {
  // console.log(req.body)
  // console.log(req.user)
  const { email } = req.user;
  const temporaryPassword = randomString.generate();

  console.log(temporaryPassword);

  hashPassword(temporaryPassword).then((hashPassword) => {
    // console.log(hashPassword)

    Users.changePassword(email, hashPassword)
      .then((results) => {
        if (results.affectedRows > 0) {
          let subject = "Password changed";
          sendEmail(email, subject, temporaryPassword);
          res.status(200).send("An email has been sent with the new password");
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("can't change the password");
      });
  });
};

module.exports = {
  createUser,
  login,
  changePassword,
  forgetPassword,
};
