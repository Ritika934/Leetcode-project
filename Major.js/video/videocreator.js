const express =require("express")
const adminmiddlewear=require("../userAuthent.js/adminmiddlewear");
const videoRouter = express.Router()
const{deleteVideo,genSign,savevideometadata} = require("./videomaker")

videoRouter.get("/create/:problemId",adminmiddlewear,genSign);

videoRouter.post("/save",adminmiddlewear,savevideometadata);

videoRouter.delete("/delete/:videoId",adminmiddlewear,deleteVideo)

module.exports= videoRouter;
