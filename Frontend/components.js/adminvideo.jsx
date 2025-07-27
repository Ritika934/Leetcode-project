
import {useEffect, useState} from "react";
import axiosclient from "../axiosclient";
import { NavLink } from "react-router";

function Adminvideo() {
    const [problem, setproblem] = useState([]);
    const [loading, setloading] = useState(false);
    const [error, setError] = useState(null)

    const fetchproblem = async () => {
        try {
            setloading(true);
            const {data} = await axiosclient.get("/problem/getallproblems");
            setError(null);
            setproblem(data);
        } catch(err) {
            console.log("Error" + err.message);
            setError(err.response?.data?.error || err.message);
        } finally {
            setloading(false);
        }
    };

    useEffect(() => {
        fetchproblem();
    }, [])

    const handledelete = async (id) => {
        if(!window.confirm("Are you sure you want to delete this video?")) return;
        
        try {
            setloading(true);
            setError(null);
            await axiosclient.delete(`/video/delete/${id}`);
            setproblem(problem.filter(problems => problems._id !== id));
        } catch(err) {
            const errorMessage = err.response?.data?.error || "Failed to delete video";
            setError(errorMessage);
            console.log(errorMessage);
        } finally {
            setloading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center">
                <span className="loading loading-spinner"></span>
            </div>
        );
    }

if(error){
    return(
        
                <div className="alert alert-error shadow-lg my-4">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                </div>
          
    )
}



    return (
        <>
           

            <div className="container mx-auto p-4">
                <div className="flex justify-center items-center mb-6">
                    <h1 className="text-3xl font-bold">
                        Video Upload and Delete
                    </h1>
                </div>
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th className="w-1/12">Index</th>
                                <th className="w-4/12">Title</th>
                                <th className="w-2/12">Difficulty</th>
                                <th className="w-3/12">Tags</th>
                                <th className="w-2/12">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {problem.map((problem, index) => (
                                <tr key={problem._id}>
                                    <th>{index+1}</th>
                                    <td>{problem.title}</td>
                                    <td>
                                        <span className={`badge ${
                                            problem.difficulty === "easy" ? "badge-success" :
                                            problem.difficulty === "medium" ? "badge-warning" :
                                            "badge-error"
                                        }`}>
                                            {problem.difficulty}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="badge badge-outline">{problem.tags}</span>
                                    </td>
                                    <td>
                                        <div className="space-x-2">
                                            <button 
                                                onClick={() => handledelete(problem._id)} 
                                                className="btn btn-error"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>


                                     <td>
                                        <div className="space-x-2">
                                           
                                                <NavLink to={`/admin/upload/${problem._id}`}
                                                className={`btn btn-primary`}>
                                                    Upload video
                                                </NavLink>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Adminvideo;