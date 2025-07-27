const express =require("express")
const usermiddlewear = require("./userAuthent.js/usermiddlewear")

const solvedoubt =require("../Major.js/llm/airoute")

const aiRouter =express.Router()


aiRouter.post("/chat",usermiddlewear,solvedoubt)

module.exports =aiRouter;