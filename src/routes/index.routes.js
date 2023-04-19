const authRouter = require('./auth.routes');

const setUpRoutes = (server) =>{
    server.use("/auth", authRouter)
}

module.exports ={
    setUpRoutes
}