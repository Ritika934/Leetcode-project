const express=require("express")
const ProblemRouter=express.Router()
const usermiddlewear=require("../userAuthent.js/usermiddlewear")
const adminmiddlewear=require("../userAuthent.js/adminmiddlewear")
const {createproblem,updateproblem,deleteproblem,getproblembyid,getAllproblems,solvedproblems,submittedanswers,problemstats}=require("./userProblem")

ProblemRouter.post("/create", adminmiddlewear, createproblem)
ProblemRouter.put("/update/:id",adminmiddlewear,updateproblem)
ProblemRouter.delete("/delete/:id",adminmiddlewear,deleteproblem)
ProblemRouter.get("/getproblem/:id",usermiddlewear,getproblembyid)
ProblemRouter.get("/getallproblems",usermiddlewear,getAllproblems)
ProblemRouter.get("/solvedproblems",usermiddlewear,solvedproblems)
ProblemRouter.get("/submittedanswer/:id",usermiddlewear,submittedanswers)
ProblemRouter.get("/stats",usermiddlewear,problemstats)



module.exports = ProblemRouter;