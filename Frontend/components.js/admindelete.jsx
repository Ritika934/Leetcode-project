import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import axiosclient from "../axiosclient";

function Admindelete() {
    const [problem, setproblem] = useState([]);
    const [loading, setloading] = useState(false);
    const [notification, setNotification] = useState(null); // 2. Add state for notifications
    const navigate = useNavigate(); // 3. Initialize the navigate function

    // This remains the same
    const fetchproblem = async () => {
        setloading(true);
        try {
            const { data } = await axiosclient.get("/problem/getallproblems");
            setproblem(data);
            setloading(false);
        } catch (err) {
            console.log("Error" + err.message);
            setloading(false);
            setNotification({ type: 'error', message: 'Failed to fetch problems.' });
        }
    };

    useEffect(() => {
        fetchproblem();
    }, []);

    // 4. Updated handledelete function
    const handledelete = async (id) => {
        // Add a confirmation before deleting for safety
        if (!window.confirm('Are you sure you want to delete this problem?')) {
            return;
        }

        try {
            // No need for a full-page loader here, we will give instant feedback
            
            // API call to delete the problem
            await axiosclient.delete(`/problem/delete/${id}`);
            
            // Show a success message
            setNotification({ type: 'success', message: 'Problem deleted successfully! Redirecting...' });

            // Update the UI by removing the deleted problem from the state
            setproblem(prevProblems => prevProblems.filter(p => p._id !== id));

            // Redirect to the Admin page after 2 seconds
            setTimeout(() => {
                navigate('/Admin');
            }, 2000);

        } catch (err) {
            console.log("Error " + err.message);
            // Show an error message
            setNotification({ type: 'error', message: 'Error deleting problem. Please try again.' });
            // Hide the error message after 3 seconds
            setTimeout(() => setNotification(null), 3000);
        }
    };

    // Show a full-page loader only on initial fetch
    if (loading && problem.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <>
            <div className="container mx-auto p-4 ">
                {/* 5. Display Notification Here */}
                {notification && (
                    <div className={`alert ${notification.type === 'success' ? 'alert-success' : 'alert-error'} shadow-lg mb-4`}>
                        <div>
                            <span>{notification.message}</span>
                        </div>
                    </div>
                )}

                <div className="flex justify-center items-center mb-6">
                    <h1 className="text-3xl font-bold">Delete problems</h1>
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
                            {problem.map((prob, index) => (
                                <tr key={prob._id}>
                                    <th>{index + 1}</th>
                                    <td>{prob.title}</td>
                                    <td>
                                        <span className={`badge ${prob.difficulty === "easy" ? "badge-success"
                                            : prob.difficulty === "medium" ? "badge-warning"
                                                : "badge-error"
                                            }`}>
                                            {prob.difficulty}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="badge badge-outline">{prob.tags}</span>
                                    </td>
                                    <td>
                                        <div className="space-x-2">
                                            <button onClick={() => handledelete(prob._id)} className="btn btn-error">
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
    );
}

export default Admindelete;
