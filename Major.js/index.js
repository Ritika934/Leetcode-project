const express=require("express")
const cors = require('cors');
const cookieParser = require('cookie-parser')
const main = require("./db"); 
require('dotenv').config()
const redisclient=require("./userAuthent.js/redis")
const authRouter=require("./userAuthent.js/Authent");
const ProblemRouter=require("./Problem.js/problemCreator")
const submitRouter = require("./Problem.js/submit")
const aiRouter=require("./airouter")
const videoRouter=require("./video/videocreator");
const apiRouter = require("./userAuthent.js/googleapi");
const streakRouter=require("./streak/streakRouter")
const helmet = require('helmet');
const resumeRouter=require("./Resume/ResumeRouter") 
const admin = require('firebase-admin');
const app=express()

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Origin is not allowed by CORS"));
    }
}));

const firebaseConfig = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Handle newlines
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

try {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig)
  });
  console.log("Firebase Admin initialized successfully");
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error);
  process.exit(1);
}

app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);





app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], 
      imgSrc: ["'self'", "https://*.googleusercontent.com", "data:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.gstatic.com"], 
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"], 
      connectSrc: ["'self'", "https://www.googleapis.com", "https://identitytoolkit.googleapis.com"],
     frameSrc: ["'self'", "ritika-s-coding-platform.firebaseapp.com"],
     
    },
  })
);


app.use(express.json())
app.use(cookieParser())

let servicesPromise;
function initializeServices() {
  if (!servicesPromise) {
    servicesPromise = Promise.all([
      main(),
      redisclient.isOpen ? Promise.resolve() : redisclient.connect(),
    ]).catch((error) => {
      servicesPromise = undefined;
      throw error;
    });
  }
  return servicesPromise;
}

app.use(async (_req, _res, next) => {
  try {
    await initializeServices();
    next();
  } catch (error) {
    next(error);
  }
});

app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));
app.use("/user",authRouter);
app.use("/problem", ProblemRouter);
app.use("/submit", submitRouter );
app.use("/ai",aiRouter)
app.use("/video", videoRouter);
app.use("/resume",resumeRouter)
app.use("/api",apiRouter)
app.use("/streak",streakRouter)

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});

if (require.main === module) {
  const port = Number(process.env.PORT || process.env.PORT_NUMBER || 3000);
  initializeServices()
    .then(() => app.listen(port, () => console.log(`API listening on port ${port}`)))
    .catch((error) => {
      console.error("Unable to start API:", error.message);
      process.exit(1);
    });
}

module.exports = app;
