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
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
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
        <div className="container mx-auto p-4 font-mono">
            <h2 className="text-2xl font-bold mb-6 text-center text-base-primary">Submission History</h2>

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














