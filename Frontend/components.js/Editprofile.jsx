
import React, { useState, useEffect } from 'react';
import axiosclient from '../axiosclient';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { User, Cake, Users, Briefcase, Sparkles, School, Trash2, PlusCircle, Upload, FileText, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

// --- Corrected: FormSection is now a standalone component ---
// It's defined outside the EditProfile component to prevent re-creation on every render.
const FormSection = ({ title, children }) => (
    <div className="bg-base-200/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-md border border-base-300/20 border-l-4 border-l-primary">
        <h2 className="text-2xl font-bold text-primary-focus mb-6">{title}</h2>
        <div className="space-y-6">{children}</div>
    </div>
);


const EditProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        FirstName: '',
        age: '',
        Gender: 'Other',
        Summary: '',
        Experience: '',
        Skills: '',
        Education: [],
        Work: '',
    });

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [hasResume, setHasResume] = useState(false);
    const [resumeMessage, setResumeMessage] = useState('');

    // Framer Motion Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                setError('');
                
                const userResponse = await axiosclient.get("/user/check");
                const fetchedUser = userResponse.data.user;

                setUserData({
                    FirstName: fetchedUser.FirstName || '',
                    age: fetchedUser.age || '',
                    Gender: fetchedUser.Gender || 'Other',
                    Summary: fetchedUser.Summary || '',
                    Experience: fetchedUser.Experience || '',
                    Skills: fetchedUser.Skills || '',
                    Education: fetchedUser.Education?.length > 0 ? fetchedUser.Education : [],
                    Work: fetchedUser.Work || '',
                });

                const resumeResponse = await axiosclient.get("/resume/check");
                if (resumeResponse.data.resume) {
                    setHasResume(true);
                }
            } catch (err) {
                console.error("Failed to load user data:", err);
                setError('Failed to load user data. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleEducationChange = (index, e) => {
        const { name, value } = e.target;
        const updatedEducation = [...userData.Education];
        updatedEducation[index] = { ...updatedEducation[index], [name]: value };
        setUserData(prev => ({ ...prev, Education: updatedEducation }));
    };

    const addEducationField = () => {
        setUserData(prev => ({
            ...prev,
            Education: [...prev.Education, { Institute: '', Degree: '' }],
        }));
    };

    const removeEducationField = (index) => {
        setUserData(prev => ({
            ...prev,
            Education: prev.Education.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            await axiosclient.put(`/user/update/${id}`, userData);
            setSuccess("Profile updated successfully! Redirecting...");
            setTimeout(() => navigate(`/profile/${id}`), 2000);
        } catch (err) {
            console.error("Error updating user:", err);
            setError(err.response?.data?.message || "An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResume = async () => {
        setResumeMessage('');
        if (hasResume) {
            try {
                const response = await axiosclient.delete(`/resume/delete/${id}`);
                setResumeMessage(response.data.message);
                setHasResume(false);
            } catch (error) {
                setResumeMessage('Failed to delete resume.');
            }
        } else {
            navigate(`/upload/resume/${id}`);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-base-100">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 p-4 sm:p-6 md:p-8 font-sans">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-base-100 via-base-200/5 to-base-100 -z-10"></div>
            
            <div className="max-w-4xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: -30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="mb-10 text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Update Your Profile
                    </h1>
                    <p className="text-base-content/70 text-lg">Keep your professional identity sharp and up to date.</p>
                </motion.div>

                <form onSubmit={handleSubmit}>
                    <motion.div className="space-y-10" variants={containerVariants} initial="hidden" animate="visible">
                        
                        {/* --- Personal Information --- */}
                        <motion.div variants={itemVariants}>
                            <FormSection title="Personal Information">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <label className="form-control w-full">
                                        <div className="label"><span className="label-text font-semibold">First Name</span></div>
                                        <div className="relative"><User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" size={20} /><input type="text" name="FirstName" value={userData.FirstName} onChange={handleChange} placeholder="Your name" className="input input-bordered w-full pl-11 focus:ring-2 focus:ring-primary" required /></div>
                                    </label>
                                    <label className="form-control w-full">
                                        <div className="label"><span className="label-text font-semibold">Age</span></div>
                                        <div className="relative"><Cake className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" size={20} /><input type="number" name="age" value={userData.age} onChange={handleChange} placeholder="Your age" className="input input-bordered w-full pl-11 focus:ring-2 focus:ring-primary" /></div>
                                    </label>
                                    <label className="form-control w-full md:col-span-2">
                                        <div className="label"><span className="label-text font-semibold">Gender</span></div>
                                        <div className="relative"><Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" size={20} /><select name="Gender" value={userData.Gender} onChange={handleChange} className="select select-bordered w-full pl-11 focus:ring-2 focus:ring-primary"><option>Male</option><option>Female</option><option>Other</option></select></div>
                                    </label>
                                </div>
                            </FormSection>
                        </motion.div>

                        {/* --- Professional Details --- */}
                        <motion.div variants={itemVariants}>
                            <FormSection title="Professional Details">
                                <label className="form-control w-full">
                                    <div className="label"><span className="label-text font-semibold">One-Line Summary</span></div>
                                    <textarea name="Summary" value={userData.Summary} onChange={handleChange} className="textarea textarea-bordered h-20 focus:ring-2 focus:ring-primary" placeholder="e.g., Passionate Full-Stack Developer with a love for React and clean code."></textarea>
                                </label>
                                <label className="form-control w-full">
                                    <div className="label">
                                      <span className="label-text font-semibold">Current Position</span></div>
                                    <div className="relative"><Briefcase 
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" 
                                    size={20} /><input type="text" name="Work" value={userData.Work}
                                     onChange={handleChange} placeholder="Software Engineer @ FangCode" 
                                     className="input input-bordered w-full pl-11 focus:ring-2 focus:ring-primary" />
                                     </div>
                                </label>
                                <label className="form-control w-full">
                                    <div className="label"><span className="label-text font-semibold">Skills</span></div>
                                    <div className="relative"><Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" size={20} /><input type="text" name="Skills" value={userData.Skills} onChange={handleChange} placeholder="React, Node.js, Python, Figma" className="input input-bordered w-full pl-11 focus:ring-2 focus:ring-primary" /></div>
                                    <div className="label"><span className="label-text-alt">
                                      Please provide comma-separated values</span></div>
                                </label>
                            </FormSection>
                        </motion.div>

                        {/* --- Resume Section --- */}
                        <motion.div variants={itemVariants}>
                            <FormSection title="Resume">
                                <div className="flex items-center gap-4">
                                    <button type="button" onClick={handleResume} className={`btn ${hasResume ? 'btn-outline btn-error' : 'btn-outline btn-primary'}`}>
                                        {hasResume ? <><FileText size={16}/> Manage Resume</> : <><Upload size={16}/> Upload Resume</>}
                                    </button>
                                    <p className="text-sm text-base-content/70">{hasResume ? "A resume is on file." : "No resume has been uploaded."}</p>
                                </div>
                                {resumeMessage && <div className="text-sm mt-2 text-info">{resumeMessage}</div>}
                            </FormSection>
                        </motion.div>

                        {/* --- Education Section --- */}
                        <motion.div variants={itemVariants}>
                            <FormSection title="Education">
                                <div className="space-y-4">
                                    {userData.Education.map((edu, index) => (
                                        <motion.div layout key={index} className="p-4 border border-base-300/50 rounded-lg bg-base-100 relative group">
                                            <button type="button" onClick={() => removeEducationField(index)} className="btn btn-xs btn-circle btn-ghost absolute top-3 right-3 text-base-content/50 hover:bg-error hover:text-white"><Trash2 size={16}/></button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <label className="form-control w-full">
                                                    <div className="label"><span className="label-text font-semibold">Institute</span></div>
                                                    <div className="relative"><School className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" size={20}/><input type="text" name="Institute" value={edu.Institute} onChange={(e) => handleEducationChange(index, e)} placeholder="University Name" className="input input-bordered w-full pl-11 focus:ring-2 focus:ring-primary"/></div>
                                                </label>
                                                <label className="form-control w-full">
                                                    <div className="label"><span className="label-text font-semibold">Degree</span></div>
                                                    <input type="text" name="Degree" value={edu.Degree} onChange={(e) => handleEducationChange(index, e)} placeholder="B.S. in Computer Science" className="input input-bordered w-full focus:ring-2 focus:ring-primary"/>
                                                </label>
                                            </div>
                                        </motion.div>
                                    ))}
                                    <button type="button" onClick={addEducationField} className="btn btn-accent btn-outline btn-sm"><PlusCircle size={16} className="mr-1"/> Add Another Institution</button>
                                </div>
                            </FormSection>
                        </motion.div>
                        
                        {/* --- Alerts & Submission --- */}
                        <motion.div variants={itemVariants} className="pt-4 space-y-4">
                            {error && <div role="alert" className="alert alert-error text-white shadow-lg"><AlertCircle size={20}/><span>{error}</span></div>}
                            {success && <div role="alert" className="alert alert-success text-white shadow-lg"><CheckCircle size={20}/><span>{success}</span></div>}
                            <div className="flex justify-between items-center pt-4">
                                <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost">
                                    <ArrowLeft size={16} /> Go Back
                                </button>
                                <button type="submit" className="btn btn-primary btn-lg shadow-lg hover:shadow-primary/30" disabled={isSubmitting}>
                                    {isSubmitting ? <span className="loading loading-spinner"></span> : 'Save Changes'}
                                </button>
                            </div>
                        </motion.div>

                    </motion.div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;