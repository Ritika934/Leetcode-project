const express = require("express")
const usermiddlewear=require("../userAuthent.js/usermiddlewear")
const {submitCode,runcode} =require("./usersubmission")
const submitRouter = express.Router()



submitRouter.post("/submit/:id", usermiddlewear, submitCode)
submitRouter.post("/run/:id", usermiddlewear, runcode)


module.exports = submitRouter ;
