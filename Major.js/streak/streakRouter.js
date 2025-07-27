const express=require("express")
const streakRouter= express.Router()
const usermiddlewear=require("../userAuthent.js/usermiddlewear")
const Streak=require("./streak")

streakRouter.patch("/update", usermiddlewear,Streak)

module.exports=streakRouter;