const usermiddlewear = require("../userAuthent.js/usermiddlewear")
const Problem=require("./problemSchema")
const {getLangaugeById, submitBatch, submittoken} = require("./problemutility")
const submission = require("./submissionSchema")
const User=require("../UserSchema")
const Streak=require("../streak/streak")

const submitCode = async (req , res) => { 
  
    try{

   const userId = req.userfind._id
   const problemId = req.params.id

   const{code,language} = req.body

   console.log(language,"language")
   
   if(!language||!code||!problemId||!userId){

    return res.status(400).send("Some field is missing")
   }

   const problem= await Problem.findById(problemId)
 

   const submittedresult = new submission({
    userId,
    problemId,
    code,
    language,
    status:"pending",
    testcasestotal : problem.hiddentestCases.length
    })
    
  const languageId= getLangaugeById(language) 
  
    const submissions = problem.hiddentestCases.map((testcases) => ({
                  source_code:code,
                  language_id: languageId,
                  stdin:testcases.input,
                  expected_output:testcases.Output      
  })
)
 const submitResult=await submitBatch(submissions)




  const resulttoken = submitResult.map((value)=> value.token )
 
   const testresult = await submittoken(resulttoken)

  
   let testcasesPassed = 0
   let runtime = 0
   let status="accepted"
   let errormessage = null
   let  memory = 0

     for(const test of testresult){
   
    if(test.status_id ==3){
        testcasesPassed = testcasesPassed +1
        runtime = runtime + parseFloat(test.time)
         memory = Math.max(memory , test.memory)
           }
     
    else{
            if(test.status_id==4){
              runtime = runtime + parseFloat(test.time)
              memory = Math.max(memory , test.memory)
               test.status="wrong"
               errormessage=test.stderr}
    

            else{
                test.status = "error"
                runtime = runtime + parseFloat(test.time)
                memory = Math.max(memory , test.memory)
                errormessage=test.stderr 
              }
          }
        }
 
    submittedresult.status = status,
    submittedresult.testcasesPassed = testcasesPassed
    submittedresult. Error_Message= errormessage
    submittedresult.runtime = runtime
    submittedresult.memory = memory
  
try{

 await  submittedresult.save();

}
 catch (saveErr) {
    console.error("Error saving submission:", saveErr);
}

    
    // submitted result ki probelmid if exist nhi krti hi solved probelms mein then problem d  ko push krdena solvedproblems sxhema
    // of userschema

   if(! req.userfind.problemSolved.includes(problemId)){
    req.userfind.problemSolved.push(problemId)
    req.userfind.save()
   }

   await Streak(req.userfind._id)
    
   const today = new Date().toISOString().split('T')[0];
        await User.findByIdAndUpdate(userId, {
            $set: { [`activity.${today}`]: true }
        });
        
   
res.status(201).json({
      success:status,
      testcases:testresult,
      totalTestCases: submittedresult.testcasestotal,
      passedTestCases: testcasesPassed,
      errormessage,
      runtime,
      memory
    });
}
    catch(err){
        res.status(500).json({
          Error:"Internal server error! Kindly try again."
        })
    }
  
}

const runcode = async(req , res) => {
    try{
   const userId = req.userfind._id
   

   const problemId = req.params.id
   
   const{code, language } = req.body


   if(!userId|| !problemId|| !code || !language)

    return res.status(400).send("Some field is missing")

   const problem = await Problem.findById(problemId)

  const languageId= getLangaugeById(language) 

const totalTestCases=problem.visibletestCases.length    

    const submissions = problem.visibletestCases.map((testcases) => ({
                  source_code:code,
                  language_id: languageId,
                  stdin:testcases.input,
                  expected_output:testcases.Output   
                  
  })
)
 const submitResult=await submitBatch(submissions)
 
  const resulttoken = submitResult.map((value)=> value.token )
 
 const testresult = await submittoken(resulttoken)

   
   let testcasesPassed = 0
   let status="accepted"
   let errormessage = null


     for(const test of testresult){
   
    if(test.status_id ==3){
        testcasesPassed = testcasesPassed +1
  }
          
     
    else{
            if(test.status_id==4){
               test.status="error"
               test.stderr=errormessage

              }

            else{
              test.status="error"
              test.stderr=errormessage
              }
          }
        }
         
 console.log( testcasesPassed,"/",totalTestCases,)

res.status(201).json({
  success:status,
  testcases:testresult,
 totalTestCases:totalTestCases,
 testcasesPassed:testcasesPassed
})
      
     
  }
    catch(err){
        res.status(500).json({
          Error:err.message
        })  }
}

module.exports = {submitCode , runcode};
