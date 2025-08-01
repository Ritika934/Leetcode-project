const mongoose=require("mongoose")
const{Schema}=mongoose

const problemSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },

    difficulty:{
        type:String,
        enum:["easy","medium","hard"],
        required:true,
    },
    tags:{
        type:[String],
        enum:["array","linked list","DP","graph"]
    },
    visibletestCases:[
        {input:{
            type:String,
            required:true,
        },
        Output:{
            type:String,
        },
        explanation:{
            type:String,
            required:true

        }

    }
],

        hiddentestCases:[
        {input:{
            type:String,
            required:true,
        },
        Output:{
            type:String,
            required:true,
        },
        explanation:{
            type:String,
            required:true

        }

    }
],
 startcode:[{
    language:
    {
        type:String,
        required:true,
    },

    initialcode:{
        type:String,
        required:true
    },


   
}],

referencesolution:[{
    language:{
        type:String,
        required:true
    },
    completeCode:{
        type:String,
        required:true
    }
}],

 problemCreator:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true
    }


})
const Problem = mongoose.model("Problem",problemSchema)

module.exports = Problem;
