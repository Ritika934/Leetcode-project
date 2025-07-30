import { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router';
import Editor from "@monaco-editor/react";
import axiosclient from "../axiosclient";
import SubmissionHistory from "../components.js/submission";
import ChatAI from "../components.js/chatai";
import Editorial from "../components.js/editorial";
import { ChevronsLeft, ChevronsRight, Code, FileText, History, Bot, Play, Check, X, Loader, BrainCircuit } 
from 'lucide-react';
import { useSelector } from 'react-redux';
const ProblemPage = () => {
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [runLoading, setRunLoading] = useState(false);
    const [submitLoading, setsubmitLoading] = useState(false);
    const [runResult, setRunResult] = useState(null);
    const [submitResult, setSubmitResult] = useState(null);
    const [activeLeftTab, setActiveLeftTab] = useState("description");
    const [activeRightTab, setActiveRightTab] = useState("code");
    const [selectedLanguage, setSelectedLanguage] = useState("javascript");
    const [initialCode, setInitialCode] = useState({});
    const [code, setCode] = useState('');
    const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
    const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

    const editorRef = useRef(null);
    let { problemId } = useParams();

    const theme = useSelector((state) => state.theme.theme);

    useEffect(() => {
        setLoading(true);
        const fetchProblem = async () => {
            try {
                const response = await axiosclient.get(`/problem/getproblem/${problemId}`);
                setProblem(response.data);
                const codes = {};
                response.data.startcode.forEach(item => {
                    codes[item.language.toLowerCase()] = item.initialcode;
                });
                setInitialCode(codes);

                const defaultLang = ['javascript', 'java', 'c++'].find(lang => codes[lang]);
                if (defaultLang) {
                    setSelectedLanguage(defaultLang);
                    setCode(codes[defaultLang]);
                }
            } catch (error) {
                console.error("Error fetching problem:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProblem();
    }, [problemId]);

    const handleLanguageChange = (lang) => {
        setSelectedLanguage(lang);
        setCode(initialCode[lang] || '');
    };

    const handleRun = async () => {
        setRunLoading(true);
        setRunResult(null);
        setActiveRightTab("testcases");
        try {
            const response = await axiosclient.post(`/submit/run/${problemId}`, {
                code: editorRef.current.getValue(),
                language: selectedLanguage,
            });

            setRunResult(response.data);
        } catch (error) {
            console.error("Run Error:", error);
            setRunResult({ success: false, error: "An error occurred while running your code." });
        } finally {
            setRunLoading(false);
        }
    };

    const submitRun = async () => {
        setsubmitLoading(true);
        setSubmitResult(null);
        setActiveRightTab("result");
        try {
            const response = await axiosclient.post(`/submit/submit/${problemId}`, {
                code: editorRef.current.getValue(),
                language: selectedLanguage,
            });
            setSubmitResult(response.data);
        } catch (error) {
            console.error("Submit Error:", error);
            setSubmitResult({ success: false, error: "An error occurred during submission." });
        } finally {
            setsubmitLoading(false);
        }
    };

    const getLanguageForMonaco = (lang) => {
        const langMap = { "javascript": "javascript", "java": "java", "c++": "cpp" };
        return langMap[lang] || "javascript";
    };

    const difficultyColor = (difficulty) => {
        const colorMap = { "easy": "text-green-400", "medium": "text-yellow-400", "hard": "text-red-400" };
        return colorMap[difficulty] || "text-gray-400";
    };

    if (loading && !problem) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-base-100">
                <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen" data-theme={theme}>
       {/* left pannel */}
               <div className={`flex flex-col bg-base-200 border-r border-base-300 transition-all duration-300 ${leftPanelCollapsed ?
                 'w-12' : 'w-1/2'}`}>
     
                        <div className="flex-shrink-0 p-2 border-b border-base-300 flex items-center">
                    
 <button onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)} className="p-2 rounded-md hover:bg-base-300">
                        {leftPanelCollapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
                    </button>




                    {!leftPanelCollapsed && (
                          <div className="tabs tabs-boxed bg-base-100 ml-2 p-2 gap-4">
                            {[
                                { id: "description", icon: <FileText size={16} />, label: "Description" },
                                { id: "editorial", icon: <BrainCircuit size={16} />, label: "Editorial" },
                                { id: "submissions", icon: <History size={16} />, label: "Submissions" },
                                { id: "chatai", icon: <Bot size={16} />, label: "ChatAI" },
                            ].map(tab => (
                                <button key={tab.id} className={`tab-sm md:tab-md flex items-center gap-2 ${activeLeftTab === tab.id ? 'bg-gray-700/80 text-white' : ''}`} onClick={() => setActiveLeftTab(tab.id)}>
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                {!leftPanelCollapsed && (
                    <div className="flex-1 overflow-y-auto p-6">
                        {problem && (
                            <>
                                {activeLeftTab === "description" && (
            <div>
                                        <div className="mb-6">
          <h1 className="text-2xl font-bold text-base-content mb-2">{problem.title}</h1>
                                            <div className="flex items-center gap-4">
                 <span className={`font-semibold capitalize ${difficultyColor(problem.difficulty)}`}>{problem.difficulty}</span>
                <span className="badge badge-outline border-blue-400/50 text-blue-300">{problem.tags}</span>
                                            </div>
                                        </div>
                                        <div className="prose prose-invert max-w-none text-base-content">{problem.description}</div>
                                        <div className="mt-8">
                                            <h3 className="text-lg font-semibold text-base-content mb-4">Examples</h3>
                                            <div className="space-y-4">
                                                {problem.visibletestCases.map((example, index) => (
                                                    <div key={index} className="bg-base-300 p-4 rounded-lg border border-gray-700/50">
                                                        <h4 className="font-semibold text-base-content mb-2">Example {index + 1}</h4>
                                                        <div className="space-y-2 text-sm font-mono">
                                                            <div><strong className="text-base-content/70">Input: </strong>{example.input}</div>
                                                            <div><strong className="text-base-content/70">Output: </strong>{example.Output}</div>
                                                            {example.explanation && <div><strong className="text-base-content/70">Explanation: </strong>{example.explanation}</div>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
     {/* {activeLeftTab === "editorial" && <Editorial secureUrl={problem.secureUrl} duration={problem.duration} />} */}
   {activeLeftTab === "editorial" && (problem.secureUrl?(
<Editorial secureUrl={problem.secureUrl} duration={problem.duration} />

   ):(<div className="container mx-auto p-4 font-mono text-base-content">
      <div className="p-6 rounded-lg bg-base-100 border border-gray-700/50 text-center">
                    <p className="text-base-content">No Editorial exist for this problem.</p>
                </div>
                </div>
   ))}
                                {activeLeftTab === "submissions" && <SubmissionHistory problemId={problemId} />}
                                {activeLeftTab === "chatai" && <ChatAI problem={problem} />}
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Right Panel */}
            <div className={`flex flex-col bg-base-100 transition-all duration-300 ${rightPanelCollapsed ? 'w-12' : 'w-1/2'}`}>
                <div className="flex-shrink-0 p-2 border-b border-base-300 flex items-center">
                    <button onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)} className="p-2 rounded-md hover:bg-gray-700/50">
                        {rightPanelCollapsed ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
                    </button>
                    {!rightPanelCollapsed && (
                        <>
                            <div className="tabs tabs-boxed bg-transparent ml-2 gap-4">
 <button className={`tab-sm md:tab-md flex items-center gap-2 ${activeRightTab === "code" ? 'bg-gray-700/80 text-white' : ''}`} onClick={() => setActiveRightTab("code")}>
                                    <Code size={16} /> Code
                                </button>
    <button className={`tab-sm md:tab-md flex items-center gap-2 ${activeRightTab === "testcases" ? 
        'bg-gray-700/80 text-white' : ''}`} onClick={() => setActiveRightTab("testcases")}>
   Testcases
    </button>
                                <button className={`tab-sm md:tab-md flex items-center gap-2 ${activeRightTab === "result" ? 'bg-gray-700/80 text-white' : ''}`} onClick={() => setActiveRightTab("result")}>
                                    Result
                                </button>
                            </div>
                            <div className="ml-auto">
                                <select value={selectedLanguage} onChange={(e) => handleLanguageChange(e.target.value)} className="select select-sm select-bordered bg-base-100 border-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-500">
                                    {Object.keys(initialCode).map(lang => (
                                        <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}
                </div>
                {!rightPanelCollapsed && (
                    <div className="flex flex-col flex-1">
                        {activeRightTab === "code" && (
                            <>
                                <div className="flex-1">
                                    <Editor
                                        key={selectedLanguage}
                                        height="100%"
                                        language={getLanguageForMonaco(selectedLanguage)}
                                        value={code}
                                        onMount={(editor) => (editorRef.current = editor)}
                                        theme={theme==="dark"?"vs-dark":"light"}
                                        options={{
                                            fontSize: 16,
                                            minimap: { enabled: false },
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                            wordWrap: "on",
                                        }}
                                    />
                                </div>
                                <div className="p-2 flex justify-end gap-2 bg-base-200 border-t border-base-300">
                                    <button className="btn btn-neutral btn-sm" onClick={handleRun} disabled={submitLoading||runLoading}>
                                     {runLoading ? <Loader className="animate-spin" /> : <Play size={16} />} Run
                                    </button>
       <button className="btn btn-primary btn-sm" onClick={submitRun} disabled={submitLoading||runLoading}>
                {submitLoading ? <Loader className="animate-spin" /> : <Play size={16} />} Submit
                                    </button>
                                </div>
                            </>
                        )}
                        {activeRightTab === "testcases" && (
 <div className="flex-1 p-4 overflow-y-auto">
    {runLoading?(<div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400"></div>
     </div>): (
      <div>
        {runResult ? (
          runResult.success === 'accepted' && runResult.testcasesPassed === runResult.totalTestCases ? (
            <div className="p-4 rounded-lg text-center bg-green-500/10">
              <div className="inline-flex items-center justify-center rounded-full p-3 mb-4 bg-green-500/20 text-green-400">
                <Check size={32} />
              </div>
              <h4 className="font-bold text-2xl mb-2 text-green-400">
                Accepted
              </h4>
              <div className="flex justify-center gap-6 text-gray-300 mt-4">
                <span>TestCases: {runResult.testcasesPassed}/{runResult.totalTestCases}</span>
              </div>
            </div>
          ) : runResult.success === 'accepted' ? (
            <div className="p-4 rounded-lg text-center bg-red-500/10">
              <div className="inline-flex items-center justify-center rounded-full p-3 mb-4 bg-red-500/20 text-red-400">
                <X size={32} />
              </div>
              <h4 className="font-bold text-2xl mb-2 text-red-400">
                Wrong
              </h4>
              <div className="flex justify-center gap-6 text-gray-300 mt-4">
                <span>Cases: {runResult.testcasesPassed}/{runResult.totalTestCases}</span>
              </div>
              <div className="mt-4 text-left">
                {runResult.testcases.map((tc, index) => (
                  tc.status === "error" && (
                    <div key={index} className="mb-4 p-3 bg-gray-800 rounded">
                      <h5 className="font-semibold mb-2">Test Case {index + 1}</h5>
                      <div className="grid grid-cols-1 gap-2">
                        <div>Input: <code className="bg-gray-700 p-1 rounded">{tc.stdin}</code></div>
                        <div>Expected Output: <code className="bg-gray-700 p-1 rounded">{tc.expected_output}</code></div>
                        <div>Your Output: <code className="bg-gray-700 p-1 rounded">{tc.stdout}</code></div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg text-center bg-red-500/10">
              <div className="inline-flex items-center justify-center rounded-full p-3 mb-4 bg-red-500/20 text-red-400">
                <X size={32} />
              </div>
              <h4 className="font-bold text-2xl mb-2 text-red-400">
                Submission Failed
              </h4>
              <div className="flex justify-center gap-6 text-gray-300 mt-4">
                {runResult.Error}
              </div>
            </div>
          )
        ) : (
          <div className="text-gray-500 text-center pt-10">Click "Submit" to evaluate your solution.</div>
        )}
      </div>
    )}
                               
                            </div>
                        )}
                        {activeRightTab === "result" && (
  <div className="flex-1 p-4 overflow-y-auto">
    {submitLoading ? (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    ) : (
      <div>
        {submitResult ? (
          submitResult.success === 'accepted' && submitResult.passedTestCases === submitResult.totalTestCases ? (
            <div className="p-4 rounded-lg text-center bg-green-500/10">
              <div className="inline-flex items-center justify-center rounded-full p-3 mb-4 bg-green-500/20 text-green-400">
                <Check size={32} />
              </div>
              <h4 className="font-bold text-2xl mb-2 text-green-400">
                Accepted
              </h4>
              <div className="flex justify-center gap-6 text-gray-300 mt-4">
                <span>Cases: {submitResult.passedTestCases}/{submitResult.totalTestCases}</span>
                <span>Runtime: {submitResult.runtime ?? 'N/A'}s</span>
                <span>Memory: {submitResult.memory ?? 'N/A'} KB</span>
              </div>
            </div>
          ) : submitResult.success === 'accepted' ? (
            <div className="p-4 rounded-lg text-center bg-red-500/10">
              <div className="inline-flex items-center justify-center rounded-full p-3 mb-4 bg-red-500/20 text-red-400">
                <X size={32} />
              </div>
              <h4 className="font-bold text-2xl mb-2 text-red-400">
                Wrong Answer
              </h4>
              <div className="flex justify-center gap-6 text-gray-300 mt-4">
                <span>Cases: {submitResult.passedTestCases}/{submitResult.totalTestCases}</span>
              </div>
              <div className="mt-4 text-left">
                {submitResult.testcases.map((tc, index) => (
                  tc.status === "error" && (
                    <div key={index} className="mb-4 p-3 bg-gray-800 rounded">
                      <h5 className="font-semibold mb-2">Test Case {index + 1}</h5>
                      <div className="grid grid-cols-1 gap-2">
                        <div>Input: <code className="bg-gray-700 p-1 rounded">{tc.stdin}</code></div>
                        <div>Expected Output: <code className="bg-gray-700 p-1 rounded">{tc.expected_output}</code></div>
                        <div>Your Output: <code className="bg-gray-700 p-1 rounded">{tc.stdout}</code></div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg text-center bg-red-500/10">
              <div className="inline-flex items-center justify-center rounded-full p-3 mb-4 bg-red-500/20 text-red-400">
                <X size={32} />
              </div>
              <h4 className="font-bold text-2xl mb-2 text-red-400">
                Submission Failed
              </h4>
              <div className="flex justify-center gap-6 text-gray-300 mt-4">
                {submitResult.errormessage}
              </div>
            </div>
          )
        ) : (
          <div className="text-gray-500 text-center pt-10">Click "Submit" to evaluate your solution.</div>
        )}
      </div>
    )}
  </div>
                         )}



                    </div>
                )} 
            </div>
            
        </div>
    );
};

export default ProblemPage;
