
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, ShieldCheck, Search, CheckCircle2, ChevronDown } from 'lucide-react';
import { LogoutUser } from "../authslice"; 
import axiosclient from "../axiosclient"; 
import ThemeToggle from "../src/Themetoggle"; 

function Homepage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.slice1);

    const [problems, setProblems] = useState([]);
    const [solvedProblems, setSolvedProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        difficulty: "all",
        status: "all",
        tag: "all"
    });

    const problemSectionRef = useRef(null);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const { data } = await axiosclient.get("/problem/getallproblems");
                setProblems(data);
            } catch (error) {
                console.error("Error fetching problems:", error);
            } finally {
                setTimeout(() => setLoading(false), 500);
            }
        };

        const fetchSolvedProblems = async () => {
            if (user) {
                try {
                    const { data } = await axiosclient.get("/problem/solvedproblems");
                    setSolvedProblems(data);
                } catch (error) {
                    console.error("Error fetching solved problems:", error);
                }
            }
        };

        fetchProblems();
        fetchSolvedProblems();
    }, [user]);

    const handleLogout = () => {
        dispatch(LogoutUser());
        setSolvedProblems([]);
        navigate('/login');
    };

    const handleScrollToProblems = () => {
        problemSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const filteredProblems = problems.filter(problem => {
        const difficultyMatch = filters.difficulty === "all" || problem.difficulty.toLowerCase() === filters.difficulty;
        const isSolved = solvedProblems.some(sp => sp._id === problem._id);
        const statusMatch = filters.status === "all" ||
            (filters.status === 'solved' && isSolved) ||
            (filters.status === 'unsolved' && !isSolved);
     
        const tagMatch = filters.tag === "all" || problem.tags?.some(tag => tag.toLowerCase() === filters.tag);
        const searchMatch = !searchQuery || problem.title.toLowerCase().includes(searchQuery.toLowerCase());
        return difficultyMatch && statusMatch && tagMatch && searchMatch;
    });

    const getDifficultyBadgeStyle = (difficulty) => {
        const baseStyle = "badge px-3 py-3 font-semibold rounded-md border text-xs";
        switch (difficulty?.toLowerCase()) {
            case "easy": return `${baseStyle} bg-green-100 text-green-800 border-green-300 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-500/40`;
            case "medium": return `${baseStyle} bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-500/40`;
            case "hard": return `${baseStyle} bg-red-100 text-red-800 border-red-300 dark:bg-rose-900/50 dark:text-rose-400 dark:border-rose-500/40`;
            default: return `${baseStyle} bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700/50 dark:text-gray-400 dark:border-gray-500/40`;
        }
    };

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } };

    return (
        <div className="min-h-screen bg-base-100 text-base-content font-sans">
    <h1>Hello everyone </h1>
            <div className="bg-base-300/70 backdrop-blur-sm border-b border-base-300/50 sticky top-0 z-50 h-14">
                <div className="container mx-auto px-4 h-full flex justify-between items-center">
                    <NavLink to="/" className="text-2xl font-bold text-primary transition-transform hover:scale-105">
                        FangCode
                    </NavLink>
                    <div className="flex-none gap-3 items-center">
                        <ThemeToggle />
                        {user && (
                             <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_5px_rgba(245,158,11,0.4)]">
                                    <div className="w-10 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2">
                                        {user.photoURL ? (<img src={user.photoURL} alt="User Avatar" />) :
                                            (<span className="text-xl font-bold text-primary flex items-center justify-center">{user.FirstName?.charAt(0).toUpperCase() || 'U'}</span>)
                                        }
                                    </div>
                                </div>
                                <ul tabIndex={0} className="mt-4 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-56">
                                    <li className="p-2 font-bold border-b border-base-300/50">Hello, {user.FirstName || 'User'}!</li>
                                    <li><button onClick={() => navigate(`/Profile/${user.id}`)} className="justify-between">Profile <User size={16} /></button></li>
                                    {user?.role === "admin" && <li><NavLink to="/Admin">Admin Panel <ShieldCheck size={16} /></NavLink></li>}
                                    <div className="divider my-1"></div>
                                    <li><button onClick={handleLogout} className="text-error font-semibold">Logout <LogOut size={16} /></button></li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full bg-gradient-to-br from-base-200 via-base-100 to-base-200 text-center py-20 px-4 shadow-md flex flex-col items-center justify-center"
            >
                <motion.h1 initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 100, delay: 0.2 }} className="text-4xl md:text-6xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-400">
                 Hi,{user.FirstName}
                </motion.h1>
                   <motion.h1 initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 100, delay: 0.2 }} className="text-4xl md:text-6xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-400">
                Welcome to Fangcode
                </motion.h1>

                <motion.p initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 100, delay: 0.4 }} className="text-lg md:text-xl text-base-content/70 max-w-2xl mx-auto mb-8">
                    Your entry to FAANG. Sharpen your skills and land your dream job.
                </motion.p>
                <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 100, delay: 0.6 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <button onClick={handleScrollToProblems} className="cursor-pointer p-3 rounded-full bg-base-300/50 hover:bg-base-300 transition-colors" aria-label="Scroll to problems">
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                            <ChevronDown size={32} />
                        </motion.div>
                    </button>
                </motion.div>
            </motion.div>

            <main className="container mx-auto p-4 md:p-8">
                {/* --- Problem Dashboard Section --- */}
                {/* We attach the ref here and add a scroll-margin-top (scroll-mt-20) */}
                {/* This ensures when we scroll, the title isn't hidden under the sticky navbars */}
                <div ref={problemSectionRef} id="problem-dashboard" className="scroll-mt-20">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="pt-8 pb-8">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-base-content/90 mb-3 text-center">Problem Dashboard</h1>
                        <p className="text-lg text-base-content/60 max-w-2xl mx-auto text-center">Flex your coding muscles. Find, filter, and solve problems to level up your skills.</p>
                    </motion.div>
                </div>

                {/* --- Sticky Filter Bar Container --- */}
                {/* This div becomes sticky. The top value is the height of the navbar (h-14 = 3.5rem = 56px) */}
                <div className="sticky top-[56px] z-40 bg-base-100/80 backdrop-blur-lg py-4 -mx-4 px-4">
                     <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="p-4 bg-base-200/60 rounded-lg border border-base-300/50"
                    >
                         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                             <div className="relative md:col-span-2">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" size={20} />
                                <input type="text" placeholder="Search by problem title..." className="input input-bordered w-full pl-12 bg-base-100 focus:ring-2 focus:ring-primary" onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 md:col-span-2 gap-4">
                                <select className="select select-bordered w-full bg-base-100 focus:ring-2 focus:ring-primary" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                                    <option value="all">All Statuses</option>
                                    <option value="solved">Solved</option>
                                    <option value="unsolved">Unsolved</option>
                                </select>
                                <select className="select select-bordered w-full bg-base-100 focus:ring-2 focus:ring-primary" value={filters.difficulty} onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}>
                                    <option value="all">All Difficulties</option>
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                                <select className="select select-bordered w-full bg-base-100 focus:ring-2 focus:ring-primary" value={filters.tag} onChange={(e) => setFilters({ ...filters, tag: e.target.value })}>
                                    <option value="all">All Tags</option>
                                    <option value="array">Array</option>
                                    <option value="linked list">Linked List</option>
                                    <option value="dp">DP</option>
                                    <option value="graph">Graph</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* --- Problem List --- */}
                {loading ? (
                    <div className="flex items-center justify-center h-64"><span className="loading loading-spinner loading-lg text-primary"></span></div>
                ) : (
                    <motion.div className="space-y-3 mt-8" variants={containerVariants} initial="hidden" animate="visible">
                        <AnimatePresence>
                            {filteredProblems.length > 0 ? (
                                filteredProblems.map(problem => (
                                    <motion.div key={problem._id} variants={itemVariants} layout className="border-l-4 border-transparent bg-base-200 border-b border-base-300 rounded-r-lg shadow-sm hover:border-primary hover:bg-base-300/50 transition-all duration-300">
                                        <NavLink to={`/problem/${problem._id}`} className="block p-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <h3 className="flex-1 text-lg font-semibold text-base-content/90 transition-colors">{problem.title}</h3>
                                                <div className="flex items-center gap-4 flex-shrink-0">
                                                    {solvedProblems.some(sp => sp._id === problem._id) && (
                                                        <div className="flex items-center gap-1.5 text-green-500 font-medium text-sm">
                                                            <CheckCircle2 size={16} /><span>Solved</span>
                                                        </div>
                                                    )}
                                                    <div className={getDifficultyBadgeStyle(problem.difficulty)}>{problem.difficulty}</div>
                                                </div>
                                            </div>
                                        </NavLink>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                                    <h3 className="text-2xl font-semibold text-base-content/70">No Problems Found</h3>
                                    <p className="text-base-content/50 mt-2">Try adjusting your search or filters.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </main>
        </div>
    );
}

export default Homepage;
