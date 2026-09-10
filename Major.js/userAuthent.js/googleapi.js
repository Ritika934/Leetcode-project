const express= require("express");
const googleSignup=require("./googlesignup")

const apiRouter= express.Router();

apiRouter.post("/auth/google",googleSignup)


module.exports= apiRouter;