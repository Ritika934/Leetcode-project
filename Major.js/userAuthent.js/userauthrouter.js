const express = require("express")
const User = require("../UserSchema")
const validate = require("./validator")
const submission=require("../Problem.js/submissionSchema")

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const redisclient = require("./redis");


const app=express()

app.use(express.json())

app.use(cookieParser())

const register = async(req,res)=>{

    try{
      
      req.body.authMethod="email_password";
 
      validate(req.body)
     
        req.body.password = await bcrypt.hash(req.body.password,10)
  
       
        req.body.role="user"


        const user = await User.create(req.body)



        const token = jwt.sign({emailId:user.emailId, role:user.role },process.env.SECRET_KEY,{expiresIn:"1d"})

        res.cookie("token",token,{
        httpOnly: true,         
        secure: true,        
        sameSite: "none"
                                 }
                  )
       const reply={
        FirstName: req.body.FirstName,
        emailId: req.body.emailId,
        id:req.body._id, 
      }
     

       res.status(201).json({
        user:reply,
        message:"Registered successfully"
      })
  
        
       
    }
    catch(err){

        res.status(400).send("Error "+err.message)

    }
}

const login=async(req,res)=>{

  try{
      authMethod="email_password";

      const emailId = req.body.emailId;
      console.log(emailId,"emailId")
      
      const databasefind= await User.findOne({emailId:emailId})

    
      if(!(databasefind)){
        throw new Error ("Invalid credentials")
      }
      
      if(!await bcrypt.compare(req.body.password,databasefind.password)){
        throw new Error ("Invalid credentials")
      }

      const token=jwt.sign({emailId:databasefind.emailId,role:databasefind.role},process.env.SECRET_KEY,{expiresIn:"1d"})
     
        res.cookie("token",token,{
        httpOnly: true,         
        secure: true,        
        sameSite: "none"
                                 }
                  )
      

      const reply={
        FirstName:databasefind.FirstName,
        emailId:databasefind.emailId,
        id:databasefind._id,
        role:databasefind.role
      }
     
      res.status(200).json({
        user:reply,
        message:"Login successfully"
      })
    }


    catch(err){
         res.status(400).json({ 
        message: err.message 
    })
}

}

const logout=async(req,res)=>{
    try{

     const{token}=req.cookies

     const payload=jwt.decode(token)

     await redisclient.set(`token:${token}`,"Blocked")

     await redisclient.expireAt(`token:${token}`,payload.exp)

     res.cookie("token",null,{expires:new Date(Date.now())})

     res.send("logged out successfully")

    }
    catch(err){
        res.status(404).send("Error "+err.message )
    }
}

const adminregister = async(req ,res) => {
   try{ 
    authMethod="email_password";
    
    validate(req.body)

    req.body.password = await bcrypt.hash(req.body.password,10)

    req.body.role="admin"

    const adminuser= await User.create(req.body)
    

   const token = await jwt.sign({emailId:adminuser.emailId,role:adminuser.role},process.env.SECRET_KEY,{expiresIn:"1d"})
        res.cookie("token",token,{
        httpOnly: true,         
        secure: true,        
        sameSite: "none"
                                 }
                  )


       const reply={
        FirstName: req.body.FirstName,
        emailId: req.body.emailId,
        id:req.body._id,
        role:adminuser.role
        
      }

    
       res.status(201).json({
        user:reply,
        message:"Registered successfully"
      })


    }


     catch (err) {
    res.status(403).send("Error: " + err.message);
  }
}

const deleteprofile = async(req , res) =>{
  try{

    const userId = req.userfind._id
    User.findByIdAndDelete(userId)
    res.status(200).send("deleted successfully")
  }
  catch(err){
    res.status(500).send("Internal server Error"+err.message)
  }
}

const updateuser=async(req , res) => {

  try{

  const{id}=req.params


  if(!id){
    return res.status(400).send("Missing Id")
  }
 const user = await User.findById(id)

 if(!user){
 return res.status(404).send("Error "+err.message)
 }


const newuser = await User.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true})

   
return res.status(200).json({
      message: "Updated successfully",
      user:newuser
    })
  }
  catch(err){
 return   res.status(500).send("Error"+err.message)
  }
}

const activityuser=async (req , res) => {
    try {
      console.log("reached in activity user")
        const user = await User.findById(req.userfind._id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
const submissions=await submission.find({userId:req.userfind._id}).select("createdAt")

 const activity={};
 submissions.forEach(sub=>{
const date=  sub.createdAt.toISOString().split("T")[0];
activity[date]=true;
 })

        res.json({ activity });
        console.log(activity,"activity")

    } 
    
    catch (error) {
        console.error("Error fetching activity data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports={register,login,logout,adminregister,deleteprofile,updateuser,activityuser};
