const cloudinary = require('cloudinary').v2;
const Problem=require("../Problem.js/problemSchema")
const User =require("../UserSchema");
const Solutionvideo = require("./solution-video");
// const {SanitizeFilter}=require("mongoose");




cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.PUBLIC_KEY_CLOUDINARY, 
        api_secret: process.env.CLOUDINARY_PRIVATEKEY
    })

const genSign=async(req,res)=>{
    
    try{

    const{problemId} =req.params;

    const userId = req.result._id;

    const problem = await Problem.findById(problemId);

    if(!problem){
        return res.status(404).json({error:"Problem doesn't exist"});
    }

    const timestamp = Math.round(new Date().getTime() / 1000)
    // public Id ke name se forder bnayega cloudinary
    const public_id=`leetcode-solutions/${problemId}/${userId}_${timestamp}`

    const uploadParams={
        public_id: public_id,
        timestamp:timestamp,
        
         }


    const signature = cloudinary.utils.api_sign_request(uploadParams,process.env.CLOUDINARY_PRIVATEKEY);


    res.json({
        signature,
        timestamp,
        public_id:public_id,
        api_key: process.env.PUBLIC_KEY_CLOUDINARY,
        cloud_name: process.env.CLOUD_NAME,
        upload_url:`https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/video/upload`,
    
    });


    }
    catch(error){
        console.log("Error in generating the upload",error);
        res.status(500).json({error:"Failed to generate upload credentials"});
    }

}

const savevideometadata=async(req,res)=>{
  
    try{

        const {problemId,cloudinaryPublicId,secureUrl,duration} = req.body;
        
        const userId = req.result._id;
        
       
       const cloudinaryResource = await cloudinary.api.resource(cloudinaryPublicId,{resource_type:"video"});
     
     if(!cloudinaryResource){
        return res.status(400).json({error:"Video not found on cloudinary"});
     }


  const existingVideo = await Solutionvideo.findOne({problemId,userId,cloudinaryPublicId});


   if(existingVideo){
    return res.status(400).json({error:"Video already exists"});
  }

   const videoSolution = Solutionvideo({
    problemId,
    userId,
    cloudinaryPublicId,
    secureUrl,
    duration:cloudinaryResource.duration||duration
})


    await videoSolution.save()
console.log("reached here")

    res.status(201).json({
      message: 'Video solution saved successfully',
      videoSolution: {
        id: videoSolution._id,
        thumbnailUrl: videoSolution.thumbnailUrl,
        duration: videoSolution.duration,
        uploadedAt: videoSolution.createdAt
      }
    });

    }
    catch(error){
    
    res.send("Error"+error.message)
    console.log(error.message,"this is error")
    }

}

const deleteVideo = async(req , res) => {

    try{


     console.log("reached here")


        const {videoId} = req.params;
        
        const userId=req.result._id;

       const video = await Solutionvideo.findOneAndDelete(videoId);

    if(!video){
        return res.status(404).json({error:"Video not found"});
    }
// invalidate true is for deleting the cdn copies
     await cloudinary.uploader.destroy(video.cloudinaryPublicId,{resource_type:"video",invalidate:true})

    res.json({message:"Video deleted successfully"})
    }
    catch(error){

        console.error("Error in deleting video",error);
        res.status(500).json({error:"Failed to delete the video"})

    }
}

module.exports = {genSign,savevideometadata,deleteVideo};