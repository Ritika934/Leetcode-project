// import {useState,useEffect} from "react";
// import axiosclient from "../axiosclient";

// const SubmissionHistory=({problemId})=>{



//     const[submission,setsubmission]=useState([]);

//     const[loading,setloading]=useState(false);

//     const[error,seterror]=useState(null);

//     const[selectedsubmission,setselectedsubmission]=useState(null);

// useEffect(()=>{
    
//     const fetchsubmission=async()=>{

//         try{

//    const response =  await axiosclient.get(`problem/submittedanswer/${problemId}`);
  
//      setsubmission(response.data)



//  seterror(null)


//         }
//         catch(err){
//             seterror("Failed to fetch problem from submission History")
//             fetchsubmission()
//         }

        
//     }

//     fetchsubmission()
// },[problemId])




// const getstatuscolor=(status)=>{
//     switch(status){
//         case "accepted":return "badge-success";
//         case"wrong":return "badge-error";
//         case "error":return "badge-warning";
//         case "pending" :return "badge-info";
//         default: return "badge-neutral";
//     }
// }

// const formatmemory=(memory)=>{
//     if (memory<1024) return `${memory}KB`;
//     return `${(memory/1024).toFixed(2)}MB`
// }

// const formatdata=(dateString)=>{
//     return new Date(dateString).toLocaleString();
// }

// if(loading){
//     return(
//         <>
//         <div className="flex justify-center items-center h-64">
//             <span className="loading loading-spinner loading-lg"></span>
//         </div>
//         </>
//     )
// }

// return(

// <>


// <div className="container mx-auto p-4">

//     <h2 className="text-2xl font-bold mb-6 text-center">Submission History</h2>

//     {submission.length === 0 ?(
      
//       <div className="alert alert-info shadow-lg">
//         <div>
//      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>      
//         <span>No submission found on this problem</span>

//         </div>
//       </div>




//     ):(
//         <>

//         <div className="overflow-x-auto">
//             <table className="table table-zebra w-full">
//                 <thead>

//             <tr>
//                 <th>#</th>
//                 <th>Language</th>
//                 <th>Status</th>
//                 <th>Runtime</th>
//                 <th>Memory</th>
//                 <th>Testcases</th>
//                 <th>submitted</th>
//                 <th>Actions</th>
//             </tr>

//                 </thead>
//                 <tbody>

//                     { submission.map((sub,index)=>(
//                         <tr key= {sub._id}>
//                             <td>{index+1}</td>
//                             <td className="text-mono">{sub.language.toUpperCase()}</td>
//                             <td className={`badge ${getstatuscolor(sub.status)} items-center`}>
//                                 {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
//                             </td>
//                             <td className="text-mono">{sub.runtime}sec</td>
//                             <td className="text-mono">{formatmemory(sub.memory)}</td>
//                             <td className="font-mono">{sub.testcasesPassed}/{sub.testcasestotal}</td>
//                             <td className="font-mono">{formatdata(sub.createdAt)}</td>
//                             <td>
//                                 <button className="btn btn-outline btn-sm" onClick={()=>setselectedsubmission(sub)}>
//                                 code</button>
//                                 </td>

//                         </tr>
//                     ))}

//                 </tbody>
//             </table>
//         </div>

//         <p className="mt-4 text-sm text-gray-500">Showing {submission.length} submissions</p>




//      </>
   
//    )}

//      {selectedsubmission &&(
//         <div className="modal modal-open">
//             <div className="modal-box w-1/2 max-w-5xl">
            
//             <h3 className="font-bold text-lg mb-4">
//                 Submission details:{selectedsubmission.language.toUpperCase()}
//             </h3>
//             <div className="mb-4">
//                 <div className="flex flex-wrap gap-2 mb-2">

//                     <span className={`badge ${getstatuscolor(selectedsubmission.status)}`}>
//                           {selectedsubmission.status.charAt(0).toUpperCase()+selectedsubmission.status.slice(1)}
//                     </span>

//                <span className="badge badge-outline">
//                 Runtime:{selectedsubmission.runtime}secs
//                </span>
                
//                 <span className="badge badge-outline">
//                     {formatmemory(selectedsubmission.memory)}
//                 </span>


//                     <span className="badge badge-outline">
//                         Passed:{selectedsubmission.testcasesPassed}/{selectedsubmission.testcasestotal}
//                         </span>
               
               
                        
//                 </div>


//                 {selectedsubmission.Error_Message &&(
//                     <div className="alert alert-error mt-2">
                        
//                         <div>
                            
//                             <span>{selectedsubmission.Error_Message}</span>
//                         </div>

//                         </div>
//                 )}

//    <pre className="p-4 bg-gray-900 text-gray-100 rounded overflow-x-auto">
//     <code>{selectedsubmission.code}</code>

//    </pre>
   
//    <div className="modal-action">
//     <button className="btn" onClick={()=>{setselectedsubmission(null)}}>Close</button>
//    </div>





//             </div>
//             </div>
//         </div>

//      )


//     }


   



// </div>


// </>)



// }
// export default SubmissionHistory;
import { useState, useEffect } from "react";
import axiosclient from "../axiosclient";
import { CheckCircle, XCircle, AlertTriangle, Clock, Code, Zap, MemoryStick, FileText, ChevronDown, ChevronUp }
 from 'lucide-react';

const SubmissionHistory = ({ problemId }) => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            setLoading(true);
            try {
                const response = await axiosclient.get(`problem/submittedanswer/${problemId}`);
                setSubmissions(response.data.finalanswer);
                setError(null);
            } catch (err) {
                setError("Failed to fetch submission history.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [problemId]);

    const getStatusInfo = (status,testcasesPassed,testcasestotal) => {
        switch (status,testcasesPassed,testcasestotal) {
            case "accepted","testcasesPassed==testcasestotal":
                return { icon: <CheckCircle className="text-green-400" />, color: "text-green-400" };
            case "accepted","testcasesPassed!==testcasestotal":
                return { icon: <XCircle className="text-red-400" />, color: "text-red-400" };


            case "error":
                return { icon: <AlertTriangle className="text-yellow-400" />, color: "text-yellow-400" };
            case "pending":
                return { icon: <Clock className="text-blue-400" />, color: "text-blue-400" };
            default:
                return { icon: <AlertTriangle className="text-gray-400" />, color: "text-gray-400" };
        }
    };

    const formatMemory = (memory) => {
        if (!memory) return 'N/A';
        if (memory < 1024) return `${memory} KB`;
        return `${(memory / 1024).toFixed(2)} MB`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 rounded-lg bg-red-500/10 text-red-400 text-center">
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 font-mono text-gray-300">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">Submission History</h2>

            {submissions.length === 0 ? (
                <div className="p-6 rounded-lg bg-[#1a1a1a] border border-gray-700/50 text-center">
                    <p className="text-gray-400">No submissions found for this problem yet.</p>
                </div>
            ) : (
                <div className="bg-[#1a1a1a] rounded-lg border border-gray-700/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full text-left">
                            <thead className="bg-gray-800/50 text-xs text-gray-400 uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Language</th>
                                    <th className="p-4">Runtime</th>
                                    <th className="p-4">Memory</th>
                                    <th className="p-4">Submitted</th>
                                    <th className="p-4 text-center">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                {submissions.map((sub) => {
   const statusInfo = getStatusInfo(sub.status,sub.testcasesPassed,sub.testcasestotal);
   const isExpanded = expandedRow === sub._id;
                                    return (
                                     <>
       <tr key={sub._id} className="hover:bg-gray-800/40 transition-colors duration-200">
        <td className={`p-4 font-semibold flex items-center gap-2 ${statusInfo.color}`}>
           {statusInfo.icon}
                                                    {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                                              </td>
                                                <td className="p-4">{sub.language.toUpperCase()}</td>                                            <td className="p-4">{sub.runtime !== null ? `${sub.runtime}s` : 'N/A'}</td>
                                                <td className="p-4">{formatMemory(sub.memory)}</td>
                                                <td className="p-4 text-sm text-gray-400">{formatDate(sub.createdAt)}</td>
                                                <td className="p-4 text-center">
                             <button onClick={() => toggleRow(sub._id)} className="p-2 rounded-md hover:bg-gray-700/50">
                                                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                    </button>
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr className="bg-[#0a0a0a]">
                                                    <td colSpan="6" className="p-0">
                                                        <div className="p-4 bg-[#2a2a2a]/30">
                                                            <h4 className="font-bold text-lg mb-4 text-white">
                                                                Submission Details
                                                            </h4>
                                 <div className="flex flex-wrap gap-4 mb-4 text-sm">
                                                                <div className="flex items-center gap-2 p-2 rounded-md bg-gray-700/40">
                                      <Zap size={16} className="text-yellow-400" />
                                                                    <span>Runtime: {sub.runtime !== null ? `${sub.runtime}s` : 'N/A'}</span>
                             </div>
                                  <div className="flex items-center gap-2 p-2 rounded-md bg-gray-700/40">
                                                                    <MemoryStick size={16} className="text-blue-400" />
                               <span>Memory: {formatMemory(sub.memory)}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 p-2 rounded-md bg-gray-700/40">
                                           <FileText size={16} className="text-green-400" />
                                                                    <span>Testcases: {sub.testcasesPassed}/{sub.testcasestotal}</span>
                                                                </div>
                                                            </div>

                                                            {sub.Error_Message && (
                                                                <div className="p-3 mb-4 rounded-md bg-red-500/10 text-red-400">
                                                                    <p><strong>Error:</strong> {sub.Error_Message}</p>
                                                                </div>
                                                            )}

                                                            <div className="bg-[#0a0a0a] rounded-lg border border-gray-700/50">
                                                                <div className="px-4 py-2 bg-gray-800/50 rounded-t-lg flex items-center gap-2">
                                                                    <Code size={16} />
                                                                    <span className="font-semibold text-white">{sub.language.toUpperCase()} Code</span>
                                                                </div>
                                                                <pre className="p-4 text-sm text-gray-200 overflow-x-auto"><code>{sub.code}</code></pre>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubmissionHistory;














