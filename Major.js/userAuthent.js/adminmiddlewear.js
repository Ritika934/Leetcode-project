const express= require("express")
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const redisclient = require("./redis");
const User=require("../UserSchema")
const app = express()


const adminmiddlewear=async(req ,res, next ) => {
    try{

    const {token}=req.cookies
    
    const payload =  jwt.verify(token,process.env.SECRET_KEY)
    

  if(!payload){
    throw new Error("Invalid User")
  }
  
  const{emailId}=payload

  const result = await User.findOne({emailId:emailId})
  
  if(!result){
    throw new Error("User doesn't exist")
  }

  if(payload.role!="admin"){

    throw new Error("Invalid")
  }

  // req.result=result

  const IsBlocked = await redisclient.exists(`token:${token}`)

  if(IsBlocked){
    throw new Error("Invalid token")
  }
    
  
  req.result = result

  next()


    }
    catch(err){
        res.send("Error"+err.message)
    }

}


module.exports = adminmiddlewear;