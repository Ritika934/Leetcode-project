const express =require("express")
const usermiddlewear=require("../userAuthent.js/usermiddlewear")
const resumeRouter = express.Router()
const Resume=require("./Resumeschema")

const{deleteresume,genSign,saveresumemetadata} = require("./Resumedata")

resumeRouter.get("/create/:userId",usermiddlewear,genSign);
resumeRouter.post("/save",usermiddlewear,saveresumemetadata);
resumeRouter.delete("/delete/:id",usermiddlewear,deleteresume)

resumeRouter.get("/check",usermiddlewear,async(req,res)=>{
    try{

   const userId= req.userfind._id
  const resume= await Resume.findOne({userId:userId})

 if(!resume){
    return res.json({resume:null})
 }

  res.json({ resume:resume });


    }
    catch(error){

    console.log("Error checking resume status:", error);
    res.status(500).json({error: "Failed to check resume status"});

    }

});

module.exports= resumeRouter;
