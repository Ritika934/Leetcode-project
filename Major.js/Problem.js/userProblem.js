const express=require("express")
const {getLangaugeById,submitBatch,submittoken}=require("./problemutility")
const Problem=require("./problemSchema")
const User=require("../UserSchema")
const submission=require("./submissionSchema")
const Solutionvideo=require("../video/solution-video")
const app=express()


app.use(express.json())

const createproblem = async(req,res) => {

    const{title,description,tags,visibletestCases,
          startcode,hiddentestCases,
         referencesolution} = req.body

         if (!title || !description || !tags || !visibletestCases || !startcode || !referencesolution||!hiddentestCases) {
  return res.status(400).send("Missing required fields");
}

    try{

        for(const {language,completeCode} of referencesolution ){

            const languageId= getLangaugeById(language)

    const submissions = visibletestCases.map((testcases) => ({
                  source_code:completeCode,
                  language_id: languageId,
                  stdin:testcases.input,
                  expected_output:testcases.Output      
  })
)




  const submitResult=await submitBatch(submissions)
  

  const resulttoken=submitResult.map((value)=> value.token )

  const testresult=await submittoken(resulttoken)

 for (const [index, result] of testResults.entries()) {
                
                if (result.status_id !== 3) {
                   
                    const failedTest = submissions[index];
                    const errorMessage = `Reference solution for ${language} failed on ${failedTest.info}.
                        Status: ${result.status.description}.
                        Input: ${failedTest.stdin}
                        Expected Output: ${result.expected_output}
                        Actual Output: ${result.stdout || 'N/A'}
                        Error: ${result.stderr || result.compile_output || 'N/A'}`;
                    
                    console.error("VALIDATION FAILED:", errorMessage);
                    return res.status(400).json({ message: errorMessage });
                }
            }
        }


  const userProblem = await Problem.create({
    ...req.body,

     problemCreator: (req.result._id)
    
    
  })

    return res.status(201).send(userProblem)
    

    }
catch(err){
  console.log("ERROR "+err.message)
   return res.status(500).send("Error"+err.message)
   
}

}

const updateproblem=async(req , res) => {

  const{id}=req.params
  if(!id){
    return res.status(400).send("Missing Id")
  }
  const{title,description,tags,visibletestCases,startcode,
        referencesolution}=req.body
  try{
        for(const {language,completeCode}of referencesolution){

            const languageId= getLangaugeById(language)
             const submissions=visibletestCases.map((testcases) => ({
                  source_code:completeCode,
                   language_id: languageId,
                  stdin:testcases.input,
                  expected_output:testcases.Output
                


  
  })
)
  const submitResult=await submitBatch(submissions)

  const resulttoken=submitResult.map((value) => value.token )

  const testresult=await submittoken(resulttoken)


  for(const test of testresult){

    if(test.status_id!=3){

    return  res.status(400).send("Error Occured")
    }
    }  
  }
  
 const DSA_Problem= await Problem.findById(id)

 if(!DSA_Problem){
 return res.status(404).send("Error"+err.message)
 }

const new_probelm= await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true})

 res.send("updated succcessfully")
 
  }
  catch(err){
 return   res.status(500).send("Error"+err.message)
  }
}

const deleteproblem=async(req , res) => {

  const{id} = req.params

const problem=Problem.findById(id)


  if(!id){
    return res.status(404).send("Id is missing")
  }

try{
    
await Problem.findByIdAndDelete(id)


  return res.status(200).send("Deleted successfully")

}

catch(err){
  res.status(500).send("Error"+err.message)
}
}

const getproblembyid =async(req , res) => {

    const {id}=req.params

    if(!id)
      return res.status(404).send("Id is missing")
  
  try{
       
      const problem = await Problem.findById(id).select("title description difficulty tags visibletestCases referencesolution startcode")

    if(!problem){
     return res.status(404).send("Problem doesn't exist")
    }

const video = await Solutionvideo.find({problemId:id})


const problemObj=problem.toObject()

if (video.length>0){
 problemObj.secureUrl=video[0].secureUrl,
 problemObj.cloudinaryPublicId=video[0].cloudinaryPublicId
 problemObj.duration=video[0].duration

  res.status(200).send(problemObj)

}

else{
 
problemObj.secureUrl = null
}

  res.status(200).send(problemObj)
    
  }

  catch(err){

    res.status(500).send("Error"+err.message)

  }
}

const getAllproblems = async(req , res) => {
  try{
    const getProblem= await Problem.find({}).select("_id title difficulty tags visibletestCases startcode problemCreator" )

    if(getProblem.length==0){
      return res.send("Document is empty")
    }
   res.send(getProblem)
  }
  catch(err){

    res.status(500).send("Error" + err.message)

  }
}

const solvedproblems = async(req , res) =>{
  
  try{

     const user = await User.findById(req.userfind._id)
     const allproblems = await user.populate({
      path : "problemSolved",
      select: "title description difficulty tags"})

  res.send(user.problemSolved)


       }

  catch(err){

  res.status(500).send("Error"+err.message)

 }

}

const submittedanswers = async(req , res) =>{
 
  try{

  const userId = await req.userfind._id
   
  const problemId = req.params.id

   const ans = await submission.find({userId,problemId})

  //  if(ans.length==0){
  //  res.json({})
  //  }

   const finalanswer= ans.filter(obj=>obj.runtime!==0||obj.memory!==0)
   
   res.status(201).json({
     finalanswer
   })

console.log(finalanswer)

  }
  catch(err){
    res.status(500).json({
      error:err.message
    })
  }

}

const problemstats = async (req, res) => {

  try{

    console.log("reached here")

   const getAllproblems=await Problem.find({})

    const totalproblems = getAllproblems.length;

  const id= req.userfind._id

  const user= await User.findById(id)

 
    const solvedproblems =await user.problemSolved.length
    res.status(200).json({       
      Totalproblems:totalproblems,
      Solvedproblems:solvedproblems
    })
  }
  catch(error){
    res.status(500).json({Error:error.message})
  }
   

};

module.exports = {createproblem,updateproblem,deleteproblem,getproblembyid,getAllproblems,solvedproblems,submittedanswers,
  problemstats
};


