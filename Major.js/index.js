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

const app = express();
console.log(reached here,"index")

let firebaseInitialized = false;
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
  "http://deploy-mern-1whq.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};


app.use(cors(corsOptions));

app.options("*", cors(corsOptions));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", allowedOrigins.join(", "));
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());
app.use(cookieParser());


app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        redis: redisclient.isReady ? 'Connected' : 'Disconnected',
        firebase: firebaseInitialized ? 'Initialized' : 'Not Initialized'
    });
});


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
    res.status(500).json({ error: 'Something went wrong!' });
});

const Initializeconnection = async() => {
    try {    
        await Promise.all([main(), redisclient.connect()]);
        console.log("DB connected");
        
        app.listen(process.env.PORT_NUMBER, () => {
            console.log(`Listening to server on port ${process.env.PORT_NUMBER}`);
        });
    } catch(err) {
        console.log("Error: " + err.message);
        process.exit(1); // Exit if DB connection fails
    }
};

Initializeconnection();
