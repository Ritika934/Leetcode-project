const express=require("express")
const usermiddlewear=require("./usermiddlewear")
const adminmiddlewear=require("./adminmiddlewear")

const authRouter=express.Router()

const{register,login,logout,adminregister,deleteprofile,updateuser,activityuser}=require("./userauthrouter")


authRouter.post("/register",register)
authRouter.post("/login",login)
authRouter.post("/logout",usermiddlewear,logout)
authRouter.put("/update/:id",usermiddlewear,updateuser)
authRouter.post("/admin/register",adminmiddlewear,adminregister)
authRouter.delete("/deleteprofile",usermiddlewear,deleteprofile)
authRouter.get('/activity/:id', usermiddlewear,activityuser)
authRouter.get("/check",usermiddlewear,(req,res)=>{
    const reply=
     {
        FirstName:req.userfind.FirstName,
        emailID:req.userfind.emailId,
        id:req.userfind._id,
        role:req.userfind.role,
        streak:req.userfind.streak,
        photoURL:req.userfind.photoURL,
        age: req.userfind.age,
          Gender: req.userfind.Gender||"Other",
          Summary:req.userfind.Summary||"",
          Experience: req.userfind.Experience||"" ,
          Skills: req.userfind.Skills||"",
          Education: req.userfind.Education &&req.userfind.Education.length > 0 ? req.userfind.Education : [],
          Work: req.userfind.Work || '',
          Resume:req.userfind.Resume||""


       

    }
        res.status(200).json({
        user:reply,
        message:"Valid user"
    })
})



module.exports=authRouter; 