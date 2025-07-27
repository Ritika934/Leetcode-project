const express=require("express")
const cookieParser = require('cookie-parser')
const main = require("./db"); 
const dotenv=require('dotenv').config()
const User=require("./UserSchema")
const redisclient=require("./userAuthent.js/redis")
const authRouter=require("./userAuthent.js/Authent");
const authuser = require("./userAuthent.js/authuser");
const ProblemRouter=require("./Problem.js/problemCreator")
const submitRouter = require("./Problem.js/submit")
const aiRouter=require("./airouter")
const videoRouter=require("./video/videocreator");
const cors = require('cors');
const apiRouter = require("./userAuthent.js/googleapi");
const streakRouter=require("./streak/streakRouter")
const helmet = require('helmet');
const resumeRouter=require("./Resume/ResumeRouter") 


const admin = require('firebase-admin');
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app=express()

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Allow resources from your own domain
      imgSrc: ["'self'", "https://*.googleusercontent.com", "data:"], // Allow images from your domain, googleusercontent.com, and data URIs
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.gstatic.com"], // Example: allow scripts from self, unsafe-inline for React dev, gstatic for Firebase
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"], // Example: allow styles from self, unsafe-inline for Tailwind/DaisyUI, Google Fonts
      // Add other directives as needed (e.g., fontSrc, connectSrc)
    },
  })
);


app.use(express.json())
app.use(cookieParser())

app.use("/user",authRouter);
app.use("/problem", ProblemRouter);
app.use("/submit", submitRouter );
app.use("/ai",aiRouter)
app.use("/video", videoRouter);
app.use("/resume",resumeRouter)
app.use("/api",apiRouter)
app.use("/streak",streakRouter)


const Initializeconnection = async() => {
    try{    

    await Promise.all([ main(), redisclient.connect() ])
    
    console.log("DB connected")


    app.listen(process.env.PORT_NUMBER,()=>{
        console.log("Listening to server ")
    })


    }
    catch(err){
        console.log("Error"+err.message)
    }


}
Initializeconnection()








