const Users = require("../models/users.model");
const jwt = require("jsonwebtoken")

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

const checkEmail = (req, res, next) => {
  const { email } = req.body;

  Users.findOneEmail(email)
    .then((results) => {
      if(results[0]){
        req.user = results[0];
        next()
      } else {
        res.status(401).send("Wrong email address, please register");
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("can't use this email address");
    });

}


const verifyToken = (req, res, next) =>{
  try{
    const authorizationHeader = req.get("Authorization");

    if(authorizationHeader == null){
      throw new Error("Authorization header is missing");
    }

    const [ type, token ] = authorizationHeader.split(" ")

    if(type !== "Bearer"){
      throw new Error("Authorization header has not the 'Bearer' type");
    }

    jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded)=>{
      if(err){
        console.error(err)
        localStorage.removeItem("user_token")
      } else {
        req.payload = decoded 
        next()
      }
    })

    // console.log(req.payload)


  }
  catch(error){
    console.error(error);
    res.status(401).send("Forbidden access")
  }

}

module.exports = {
  createNewUser,
  checkEmail,
  verifyToken
};
