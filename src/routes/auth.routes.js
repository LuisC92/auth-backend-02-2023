// const express = require('express')
// const authRouter = express.Router()
const authRouter = require('express').Router()
const Users = require("../controllers/users.controller.js")
const { createNewUser, checkEmail, verifyToken } = require("../middlewares/users.middleware.js")

//* create a new user, endpoint: ..../auth/sign-up
authRouter.post("/sign-up", createNewUser, Users.createUser)

//* login with an user, endpoint: ..../auth/login
authRouter.post("/login", checkEmail ,Users.login)

//* login with an user, endpoint: ..../auth/change-password
authRouter.post("/change-password", verifyToken ,Users.changePassword)


module.exports = authRouter