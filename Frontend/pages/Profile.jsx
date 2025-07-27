



import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from 'react-router';
import { motion } from "framer-motion";
import { User, Edit, CheckCircle2 } from 'lucide-react';
import axiosclient from "../axiosclient";
import StreakCounter from "./Streak"; // Assuming this component is styled
import CalendarHeatmap from "../components.js/Calenderheatmap"; // Assuming this component is styled

function Profile() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.slice1);

    const [solvedProblems, setSolvedProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [stats, setStats] = useState({
        solved: 0,
        total: 0
    });

    // Framer Motion variants for animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    useEffect(() => {
        setLoading(true);

        const fetchUserData = async () => {
            try {
                const { data } = await axiosclient.get("/user/check");
                setUserData(data.user);
            } catch (error) {
                console.log("Error fetching user data: ", error);
            }
        };

        const fetchSolvedProblems = async () => {
            try {
                const { data } = await axiosclient.get("/problem/solvedproblems");
                setSolvedProblems(data);
            } catch (error) {
                console.log("Error in fetching solvedproblems: " + error);
            }
        };

        const fetchProblemStats = async () => {
            try {
                const { data } = await axiosclient.get("/problem/stats");
                setStats({
                    solved: data.Solvedproblems || 0,
                    total: data.Totalproblems || 0
                });
            } catch (error) {
                console.log("Error in fetching the problem stats" + error);
            } finally {
                setLoading(false); // Set loading to false after all data is fetched
            }
        };

        fetchUserData();
        if (user) {
            fetchSolvedProblems();
            fetchProblemStats();
        }
    }, [user]);

    const overallPercentage = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (overallPercentage / 100) * circumference;

    const getDifficultyBadgeStyle = (difficulty) => {
        const baseStyle = "badge px-3 py-3 font-semibold rounded-md border text-xs";
        switch (difficulty?.toLowerCase()) {
            case "easy": return `${baseStyle} bg-green-100 text-green-800 border-green-300 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-500/40`;
            case "medium": return `${baseStyle} bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-500/40`;
            case "hard": return `${baseStyle} bg-red-100 text-red-800 border-red-300 dark:bg-rose-900/50 dark:text-rose-400 dark:border-rose-500/40`;
            default: return `${baseStyle} bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700/50 dark:text-gray-400 dark:border-gray-500/40`;
        }
    };
    
    const getTagBadgeStyle = () => {
        return "badge badge-info px-3 py-3 font-semibold rounded-md border text-xs bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-900/50 dark:text-sky-300 dark:border-sky-500/40";
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    }

    return (
        <div className="min-h-screen bg-base-200 font-sans">
            <div className="container mx-auto p-4 md:p-8">
                {/* Profile Header */}



                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-base-content/90 mb-2">User Profile</h1>
                    <p className="text-lg text-base-content/60">Your progress, stats, and solved challenges.</p>
                </motion.div>

                {/* Main Content Grid */}
                <motion.div 
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Left Column: User Info & Stats */}
                    <div className="lg:col-span-1 flex flex-col gap-8">
                        {/* User Info Card */}
                        <motion.div variants={itemVariants} className="card bg-base-100 shadow-lg border border-base-300/50">
                            <div className="card-body items-center text-center">
                                <div className="avatar mb-4">
                                   <div className="w-10 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2">
                                        {user.photoURL ? (<img src={userData.photoURL} alt="User Avatar" />) :
                                            (<span className="text-xl font-bold text-primary flex items-center justify-center">{user.FirstName?.charAt(0).toUpperCase() || 'U'}</span>)
                                        }
                                    </div>
                                </div>
                                <h2 className="card-title text-2xl">{userData?.FirstName || 'User'}</h2>
                                <p className="text-base-content/60">{userData?.emailID}</p>
                                <div className="mt-4 w-full">
                                     <StreakCounter streak={userData?.streak?.current || 0} />
                                </div>
                                <div className="card-actions mt-6 w-full">
                                    <button onClick={() => navigate(`/Userupdate/${userData.id}`)} className="btn btn-primary btn-block">
                                        <Edit size={16}/> Edit Profile
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Progress Card */}
                        <motion.div variants={itemVariants} className="card bg-base-100 shadow-lg border border-base-300/50">
                            <div className="card-body items-center text-center">
                                <h2 className="card-title mb-4">Overall Progress</h2>
                                <div className="relative w-48 h-48">
                                    <svg className="w-full h-full" viewBox="0 0 120 120">
                                        <circle className="text-base-300" strokeWidth="10" stroke="currentColor" fill="transparent" r={radius} cx="60" cy="60" />
                                        <motion.circle
                                            className="text-primary"
                                            strokeWidth="10"
                                            strokeDasharray={circumference}
                                            strokeLinecap="round"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r={radius}
                                            cx="60"
                                            cy="60"
                                            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                                            initial={{ strokeDashoffset: circumference }}
                                            animate={{ strokeDashoffset: offset }}
                                            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-extrabold text-primary">{`${overallPercentage}%`}</span>
                                        <span className="text-base-content/70 font-semibold">{stats.solved} / {stats.total}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Solved Problems & Calendar */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                         {/* Solved Problems Section */}
                         <motion.div variants={itemVariants} className="card bg-base-100 shadow-lg border border-base-300/50">
                            <div className="card-body">
                                <h2 className="card-title mb-4 text-xl">Recently Solved Problems</h2>
                                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                    {solvedProblems.length > 0 ? (
                                        solvedProblems.map(problem => (
                                            <motion.div 
                                                key={problem._id} 
                                                className="border-l-4 border-transparent bg-base-200/80 rounded-r-lg shadow-sm hover:border-primary hover:bg-base-300/50 transition-all duration-300 p-4"
                                                variants={itemVariants}
                                                layout
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <NavLink to={`/problem/${problem._id}`} className="flex-1 text-lg font-semibold text-base-content/90 hover:text-primary transition-colors">
                                                        {problem.title}
                                                    </NavLink>
                                                    <div className="flex items-center gap-3 flex-shrink-0">
                                                        <div className={getDifficultyBadgeStyle(problem.difficulty)}>{problem.difficulty}</div>
                                                        <div className={getTagBadgeStyle()}>{problem.tags}</div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 text-base-content/60">
                                            <CheckCircle2 size={40} className="mx-auto mb-2"/>
                                            <p>No problems solved yet. Time to start coding!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                        
                        {/* Calendar Heatmap Section */}
                        <motion.div variants={itemVariants} className="card bg-base-100 shadow-lg border border-base-300/50">
                            <div className="card-body">
                                 <h2 className="card-title mb-4 text-xl">Coding Activity</h2>
                                <CalendarHeatmap userId={userData?.id} />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default Profile;