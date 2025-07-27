import {useEffect,useState} from "react";
import axiosclient from "../axiosclient";


function Admindelete(){
    const[problem,setproblem] = useState([]);

    const[loading,setloading]=useState(false);

    const[error,seterror]=useState(null);


if (loading){
    return(
        <>
        <div className="flex justify-center items-center" >
            <span className="loading loading-spinner"></span>
        </div>
        </>
    )

 }

    const fetchproblem=async()=>{
    try{

      const {data}= await axiosclient.get("/problem/getallproblems");

      setproblem(data);

      setloading(false)

    }
    catch(err){
        console.log("Error" +err.message)
    }
}

useEffect(()=>{
    fetchproblem()
},[])

 const handledelete = async (id) => {
    try {
      setloading(true);
      await axiosclient.delete(`/problem/delete/${id}`);
      
      setproblem(problem.filter(problems => problems._id !== id));
      setloading(false);
    } catch (err) {
      console.log("Error " + err.message);
      setloading(false);
    }
  };


return(
    <>
   
<div className="container mx-auto p-4 ">
    <div className="flex justify-center items-center mb-6">
        <h1 className="text-3xl font-bold ">
            Delete problems
        </h1>
        
         </div>
         <div className="overflow-x-auto">
            <table className="table table-zebra w-full">

        <thead>
            <tr>
                <th className="w-1/12">  Index</th>
                <th className="w-4/12">Title</th>
                <th className="w-2/12"> Difficulty     </th>
                <th className="w-3/12">   Tags     </th>
                <th className="w-2/12">  Actions     </th>
            </tr>


        </thead>

<tbody>

    {problem.map((problem,index)=>(

        <tr key={problem._id}>
        <th>{index+1}</th>
        <td>{problem.title}</td>

        <td><span className={`badge ${problem.difficulty==="easy"?"badge-success"
            :problem.difficulty==="medium"?"badge-warning"
           : "badge-error"
        }`}> {problem.difficulty}</span></td>

    <td>
        <span className="badge badge-outline">{problem.tags}</span>
    </td>

    <td>
        <div className="space-x-2">
             <button onClick={()=>handledelete(problem._id)} className="btn btn-error"> 
                Delete
            </button>
            </div>
            
    </td>
        
        </tr>
    ))}
</tbody>




            </table>
         </div>
</div>

    </>
)
    
}


export default Admindelete;