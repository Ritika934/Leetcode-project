const mongoose=require("mongoose")

const {Schema}=mongoose;

const Resumeschema=new Schema({

    userId:{
      type:Schema.Types.ObjectId,
      ref:"User",
      required:true
    },

    cloudinaryPublicId:{
        type:String,
        required:true,
        unique:true,
    },

    secureUrl:{
        type:String,
        required:true
    },

format:{
    type:String
},

pages:{
    type:Number
}
}
,
{
      timestamps: true 
}
)


const Resume=mongoose.model("Resume",Resumeschema)

module.exports= Resume;























