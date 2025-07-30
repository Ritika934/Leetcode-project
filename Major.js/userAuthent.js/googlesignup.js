const express=require("express")
const User=require("../UserSchema")
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app=express()

app.use(express.json())

app.use(cookieParser())

const googleSignup = async(req,res)=>{

  try {
    const {FirstName,emailId ,_id ,photoURL} = req.body;
    
    const user = await User.findOne({emailId :emailId});

    if (!user)
       {
        console.log("reached in if block")
     const user = new User({
        emailId : emailId,
        FirstName:FirstName,
        googleId:_id,
        authMethod:"google",
        photoURL:photoURL

        
      });

      await user.save();
const token = jwt.sign({emailId:user.emailId,FirstName:user.FirstName, photoURL:user.photoURL},process.env.SECRET_KEY,{expiresIn:"1d"})

 res.cookie("token",token,{max_age:60*60*1000, 
                           httpOnly: true,         
  secure: true,            
  sameSite: "none",      
  domain: ".onrender.com"})

  const reply={
        FirstName: user.FirstName,
        emailId: user.emailId,
        photoURL:user.photoURL,
        googleId:_id,

      }
     
       res.status(201).json({
        user:reply,
        message:"Registered successfully"
      })

    } 
 
    else {

      
 const token = jwt.sign({emailId:user.emailId,FirstName:user.FirstName,googleId:user.googleId,photoURL:user.photoURL},process.env.SECRET_KEY,{expiresIn:"1d"})

 res.cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000, 
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });
 
       const reply={
        FirstName: user.FirstName,
        emailId: user.emailId,
        photoURL:user.photoURL,
        googleId:_id,
      }
     

    res.status(201).json({
        user:reply,
        message:"Google Login successfully"
      })

    }} 

  catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({error: 'Authentication failed'});
  }
}
module.exports= googleSignup;
