const express=require("express")
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const redisclient = require("./redis");
const User=require("../UserSchema")


const usermiddlewear = async(req , res , next) => {

    try{

      

        const {token} = req.cookies

        const payload = await jwt.verify(token,process.env.SECRET_KEY)

    
        if(!payload){
            throw new Error("User doesn't find")
        }

        const{emailId} = payload;
        
        const userfind = await User.findOne({emailId:emailId})
     
        
        if(!(userfind))
            {
            throw new Error("user doesn't exist")
            }

    const IsBlocked = await redisclient.exists(`token:${token}`)   
    if (IsBlocked){
        throw new Error("Invalid token")
    }


     req.userfind = userfind
    
    next()

    }
    catch(err){
        res.status(401).send("Error "+err.message)
    }
}

module.exports = usermiddlewear;
