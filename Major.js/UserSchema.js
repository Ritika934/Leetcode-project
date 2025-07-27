const mongoose=require("mongoose")
const{Schema}=mongoose
const userschema=new Schema({

    googleId: {
    type: String,
    required: function() { return this.authMethod === 'google' },
  },

   photoURL:{
    type:String
   },

  activity:{
    type:Map,
    of:Boolean,
    default:{}

  },

    FirstName:{
        type:String,
        minLength:3,
        maxLength:20,
        required:true

    },

    age:{
        type:Number,
        min:10,
        max:50
    },

    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    
    problemSolved:{
        type:[{
            type : Schema.Types.ObjectId,
        ref:"Problem",
        }]
        
    },
    
    streak: {
    current: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: null }
  },

Gender:{
         type:String,
        enum:["Male","Female","Other"],
},

Summary:{
    type:String
},

Experience:{
    type:String
},

Skills:{
type:String
},

Education:[
    {
        Institute:{
            type:String
        },
        Degree:{
            type:String
        }

    }
],
Work:{
    type:String
},
    password:{
     type:String,
    required: function() { return this.authMethod === 'email_password'; }
    },


    emailId:{
        type:String,
        required:true
    },

    authMethod: {
    type: String,
    enum: ["google", "email_password"],
    required: true
  },




},{timestamps:true})


userschema.post("findOneAndDelete", async function(userinfo){
    if (userinfo){
    await mongoose.model("submission").deleteMany({userId: userinfo._id})}
} )

const User = mongoose.model("User",userschema)
module.exports = User;


