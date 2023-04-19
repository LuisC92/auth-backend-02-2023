// const express = require('express')
// const authRouter = express.Router()
const authRouter = require('express').Router()
const Users = require("../controllers/users.controller.js")
const { createNewUser } = require("../middlewares/users.middleware.js")

//* create a new user, endpoint: ..../auth/sign-up
authRouter.post("/sign-up", createNewUser, Users.createUser)


module.exports = authRouter