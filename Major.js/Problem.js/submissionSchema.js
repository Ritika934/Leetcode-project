const mongoose= require("mongoose")
const{Schema}=mongoose

const SubmissionSchema=new Schema({
    
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    problemId:{
        type:Schema.Types.ObjectId,
        ref:"Problem",
        required:true
    },
    code:{
        type:String,
        required:true,
    },
    language:{
        type:String,
        required:true,
        enum:["c++","java","javascript"]
    },
    status:{
        type:String,
        enum:["pending","accepted","wrong","error"],
        default:"pending"
    },
    runtime:{
        type:Number,
        default:0
    },
    memory:{
     type:Number,
        default:0
    },
    Error_Message:{
        type:String,
        default:""
    },
    testcasesPassed:{
        type:Number,
        default:0
    },
    testcasestotal:{
        type:Number,
        default:0
    }

},{timestamps:true})

const submission = mongoose.model("submission",SubmissionSchema)

SubmissionSchema.index({userId:1,problemId:1})


module.exports = submission;

