const express = require("express");
const cookieParser = require('cookie-parser');
const main = require("./db"); 
const dotenv = require('dotenv').config();
const User = require("./UserSchema");
const redisclient = require("./userAuthent.js/redis");
const authRouter = require("./userAuthent.js/Authent");
const authuser = require("./userAuthent.js/authuser");
const ProblemRouter = require("./Problem.js/problemCreator");
const submitRouter = require("./Problem.js/submit");
const aiRouter = require("./airouter");
const videoRouter = require("./video/videocreator");
const cors = require('cors');
const apiRouter = require("./userAuthent.js/googleapi");
const streakRouter = require("./streak/streakRouter");
const helmet = require('helmet');
const resumeRouter = require("./Resume/ResumeRouter");
const admin = require('firebase-admin');
const mongoose = require('mongoose');

const app = express();


let firebaseInitialized = false;
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
        const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        firebaseInitialized = true;
        console.log("Firebase initialized successfully");
    } catch (error) {
        console.error("Firebase initialization error:", error.message);
    }
}


app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "https://*.googleusercontent.com", "data:", "blob:"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://www.gstatic.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https://leetcode-project-pearl.vercel.app"],
        frameSrc: ["'self'", "https://www.youtube.com"]
    }
}));


const allowedOrigins = [
    "https://leetcode-project-frontend.vercel.app",
    "http://deploy-mern-1whq.vercel.app",
    "http://localhost:3000" 
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    optionsSuccessStatus: 200
};


app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.options('*', cors(corsOptions));

app.use("/user", authRouter);
app.use("/problem", ProblemRouter);
app.use("/submit", submitRouter);
app.use("/ai", aiRouter);
app.use("/video", videoRouter);
app.use("/resume", resumeRouter);
app.use("/api", apiRouter);
app.use("/streak", streakRouter);


app.use((err, req, res, next) => {
    console.error(err.stack);
    
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ 
            error: 'CORS Error', 
            message: 'Request not allowed from this origin' 
        });
    }
    
    res.status(500).json({ 
        error: 'Internal Server Error', 
        message: 'Something went wrong!' 
    });
});

// Initialize Connections
const Initializeconnection = async() => {
    try {    
        await Promise.all([main(), redisclient.connect()]);
        console.log("DB connected");
        
        app.listen(process.env.PORT || 3001, () => {
            console.log(`Server running on port ${process.env.PORT || 3001}`);
        });
    } catch(err) {
        console.log("Error: " + err.message);
        process.exit(1);
    }
};

Initializeconnection();
