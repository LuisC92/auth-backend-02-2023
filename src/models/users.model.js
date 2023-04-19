const database = require("../../db-config");

const create = (user) => {
  return database
    .query("INSERT INTO users SET ?", user)
    .then(([results]) => results);
};

const findOneEmail = (email) => {
  return database
    .query("SELECT * FROM users WHERE email = ?", email)
    .then(([results]) => results);
};

module.exports = {
  create,
  findOneEmail,
};
