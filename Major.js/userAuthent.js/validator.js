const express=require("express")
const app=express()
app.use(express.json())
const validator = require('validator');

async function validate(data){

         if (!data) throw new Error("Request data is missing");  

     const mandatoryfield = ["FirstName","emailId", "password" ]

    const IsAllowed = mandatoryfield.every((k)=>Object.keys(data).includes(k))

    if(!(IsAllowed)){
        throw new Error("Field is missing")
    }
    
    const email = data.emailId
    
    if(!validator.isEmail(email)){
        throw new Error("Invalid email")
    }
    const password=data.password
    if (! validator.isStrongPassword(password)){
        throw new Error("Weak password")
    }

   
}
module.exports= validate;