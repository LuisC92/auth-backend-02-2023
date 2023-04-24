const express = require('express')
require("dotenv").config();
const server = express()
const {setUpRoutes} = require("./src/routes/index.routes")
const cors = require("cors")

const port = process.env.PORT || 8001

server.use(express.json())

server.use(
    cors({
        "origin": "http://localhost:3000"
    })
)

setUpRoutes(server)

server.listen(port, ()=>{
    console.log("server listening on port ", port)
})