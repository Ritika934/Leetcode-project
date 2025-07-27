// const axios = require("axios")

// const getLangaugeById=(lang)=>{
//     const language={
//         "c++":54,
//         "java":62,
//         "javascript":63,

//      }
//        return language[lang.toLowerCase()];
//     }

// const submitBatch = async(submissions) => {
//   //  const encodedSubmissions = submissions.map(submission => ({
//   //       ...submission,
//   //       source_code: Buffer.from(submission.source_code).toString('base64')
//   //   }));


// const options = {
//   method: 'POST',
//   url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
//   params: {
//     base64_encoded: 'false'
//   },
  
//   headers: {
//     // 'x-rapidapi-key': '3a3d266026mshb586366240462d3p13e1f3jsnf71f9e1eedf2',
//     'x-rapidapi-key': '15a5060426msh16d30e2b3812e73p1f6489jsn1173fa73d42c',
//     'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
//     'Content-Type': 'application/json'
//   },
//   data: {
//     submissions
//   }
// };

// async function fetchData() {
// 	try {
// 		const response = await axios.request(options);
// 		 return response.data;
       
// 	} catch (error) {
// 		console.error(error);
// 	}
// }

// return await fetchData();

// }

// const waiting = (timer) => {
//     return new Promise(resolve => setTimeout(resolve, timer));
// }

// const submittoken = async(resultoken) => {
//   const options = {
//   method: 'GET',
//   url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
//   params: {
//     tokens: resultoken.join(","),
//     base64_encoded: 'false',
//     fields: '*'
//   },
//   headers: {
//     // 'x-rapidapi-key': '3a3d266026mshb586366240462d3p13e1f3jsnf71f9e1eedf2',
//     'x-rapidapi-key': '15a5060426msh16d30e2b3812e73p1f6489jsn1173fa73d42c',
//     'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
//   }
// };

// async function fetchData() {
// 	try {
// 		const response = await axios.request(options);
// 		return response.data;
// 	} 
//   catch (error) {
// 		console.error(error);
// 	}
// }
// while(true){

//   const result=await fetchData();


//   const Isresultobtained=result.submissions.every((r)=>r.status_id>2)

//   if(Isresultobtained){
//     return result.submissions;
//   }


//   await waiting(1000)
// }
// }

// module.exports={getLangaugeById,submitBatch,submittoken}


const axios = require("axios");

const getLangaugeById = (lang) => {
    const language = {
        "c++": 54,
        "java": 62,
        "javascript": 63,
    };
    return language[lang.toLowerCase()];
};

const submitBatch = async(submissions) => {
    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            base64_encoded: 'false'
        },
        headers: {
            // It's generally better to use environment variables for API keys
            // 15a5060426msh16d30e2b3812e73p1f6489jsn1173fa73d42c
            'x-rapidapi-key': 'cd967ad053msh1060205bf58c511p11c65ajsn41f8e149e59e',
            // cd967ad053msh1060205bf58c511p11c65ajsn41f8e149e59e',
            // 83132b7981msh754a9987688db5ep1e4852jsn1e82551aa435
            // a3d266026mshb586366240462d3p13e1f3jsnf71f9e1eedf2',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {
            submissions
        }
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error("Error submitting batch to Judge0:", error.message || error);
        // It's good practice to rethrow or handle the error appropriately
        throw new Error("Failed to submit batch to Judge0.");
    }
};

// --- CORRECTED WAITING FUNCTION ---
const waiting = (timer) => {
    return new Promise(resolve => setTimeout(resolve, timer));
};
// --- END CORRECTION ---

const submittoken = async(resultoken) => {
    const options = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            tokens: resultoken.join(","),
            base64_encoded: 'false',
            fields: '*'
        },
        headers: {
            // It's generally better to use environment variables for API keys
            'x-rapidapi-key': 'cd967ad053msh1060205bf58c511p11c65ajsn41f8e149e59e',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        }
    };

    while (true) {
        try {
            const response = await axios.request(options);
            const submissions = response.data.submissions;

            // Judge0 returns 'submissions' as an array directly in the response data for batch GET
            // Make sure `response.data` has a `submissions` array.
            if (!submissions || !Array.isArray(submissions)) {
                console.error("Unexpected response structure from Judge0 GET tokens:", response.data);
                throw new Error("Invalid Judge0 response for token status check.");
            }

            // Status ID 1 = In Queue, 2 = Processing. We want to wait for anything > 2
            const areAllResultsObtained = submissions.every((r) => r.status_id > 2);

            if (areAllResultsObtained) {
                return submissions;
            }

            console.log("Waiting for Judge0 results..."); // Optional: for debugging
            await waiting(1000); // Wait for 1 second before polling again
        } catch (error) {
            console.error("Error fetching submission tokens from Judge0:", error.message || error);
            throw new Error("Failed to retrieve submission results from Judge0.");
        }
    }
};

module.exports = { getLangaugeById, submitBatch, submittoken };