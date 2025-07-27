const cloudinary = require('cloudinary').v2;
const User =require("../UserSchema");
const Resume=require("./Resumeschema")

cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.PUBLIC_KEY_CLOUDINARY, 
        api_secret: process.env.CLOUDINARY_PRIVATEKEY
    })

const genSign=async(req,res)=>{
    
    try{

    const userId = req.userfind._id;
    const timestamp = Math.round(new Date().getTime() / 1000)
    
    const public_id=`resume-user/${userId}_${timestamp}`

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
        upload_url:`https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/raw/upload`,
    
    });


    }
    catch(error){
        console.log("Error in generating the upload",error);
        res.status(500).json({error:"Failed to generate upload credentials"});
    }

}

const saveresumemetadata =async(req,res)=>{
  
    try{

        const {cloudinaryPublicId,secureUrl} = req.body;
        
        const userId = req.userfind._id;
        
       
       const cloudinaryResource = await cloudinary.api.resource(cloudinaryPublicId,{resource_type:"raw"});
     if(!cloudinaryResource){
        return res.status(400).json({error:"Resume not found on cloudinary"});
     }

  const existingResume = await Resume.findOne({userId})

  if(existingResume){
    return res.json({message:"The resume already exist"})
  }

 const resume = new Resume({
            userId,
            cloudinaryPublicId,
            secureUrl,
            format: cloudinaryResource.format,
            pages: cloudinaryResource.pages
        });

        await resume.save();

        res.status(201).json({
            message: 'Resume saved successfully',
            resumeUrl: resume.secureUrl
        });
    }
    catch(error){
    
    res.send("Error"+error.message)
    console.log("Error"+error.message)
    }

}

const deleteresume = async(req , res) => {

    try{        
        const userId=req.userfind._id;

        console.log(userId)
      const resume = await Resume.findOne({userId:userId})
       console.log(resume)

      await Resume.findOneAndDelete(resume);

    if(!resume){
        return res.status(404).json({error:"Resume does't exist"});
    }
     // Invalidate true is for deleting the cdn copies

     await cloudinary.uploader.destroy(resume.cloudinaryPublicId,{resource_type:"raw",invalidate:true})

    res.json({message:"Resume deleted successfully"})
    }
    catch(error){

        console.error("Error in deleting the resume",error);
        res.status(500).json({error:"Failed to delete the delete the resume"})

    }
}






module.exports = {genSign,saveresumemetadata,deleteresume,};