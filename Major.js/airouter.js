const express =require("express")
const usermiddlewear = require("./userAuthent.js/usermiddlewear")

const solveDoubt=require("./solvedoubt")

const aiRouter =express.Router()


aiRouter.post("/chat",usermiddlewear,solveDoubt)

module.exports =aiRouter;
