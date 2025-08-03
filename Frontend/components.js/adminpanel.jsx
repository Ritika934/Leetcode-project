import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion } from "framer-motion";
import axiosclient from "../axiosclient";
import { useState } from "react";
import { FileText, ListChecks, Code2, PlusCircle, Trash2, Save, AlertCircle, CheckCircle } from 'lucide-react';

// Zod schema remains the same
const problemSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    tags: z.enum(['array', 'linked list', 'DP', 'graph']),
    visibletestCases: z.array(
        z.object({
            input: z.string().min(1, "Input is required"),
            Output: z.string().min(1, "Output is required"),
            explanation: z.string().min(1, "Explanation is required")
        })
    ).min(1, "At least one visible test case is required"),
    hiddentestCases: z.array(
        z.object({
            input: z.string().min(1, "Input is required"),
            Output: z.string().min(1, "Output is required"),
            explanation: z.string().min(1, "Explanation is required")
        })
    ).min(1, "At least one hidden test case is required"),
    startcode: z.array(
        z.object({
            language: z.enum(["c++", "java", "javascript"]),
            initialcode: z.string().min(1, "Initial code is required")
        })
    ).length(3, "All languages initial codes are required"),
    referencesolution: z.array(
        z.object({
            language: z.enum(["c++", "java", "javascript"]),
            completeCode: z.string().min(1, "Reference solution is required")
        })
    ).length(3, "All languages reference solutions are required")
});

// Reusable FormSection component defined outside
const FormSection = ({ title, icon, children }) => (
    <div className="bg-base-200/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-md border border-base-300/20 border-l-4 border-l-primary">
        <h2 className="text-2xl font-bold text-primary-focus mb-6 flex items-center gap-3">
            {icon}
            {title}
        </h2>
        <div className="space-y-6">{children}</div>
    </div>
);

function Adminpanel() {
    const [activeTab, setActiveTab] = useState(0);
    const [formStatus, setFormStatus] = useState({ message: '', type: '' }); // 'success' or 'error'

    const { register, handleSubmit, formState: { errors, isSubmitting }, control } = useForm({
        resolver: zodResolver(problemSchema),
        defaultValues: {
            difficulty: 'easy',
            tags: 'array',
            visibletestCases: [{ input: '', Output: '', explanation: '' }],
            hiddentestCases: [{ input: '', Output: '', explanation: '' }],
            startcode: [
                { language: "c++", initialcode: '' },
                { language: "java", initialcode: '' },
                { language: "javascript", initialcode: '' }
            ],
            referencesolution: [
                { language: "c++", completeCode: '' },
                { language: "java", completeCode: '' },
                { language: "javascript", completeCode: '' }
            ]
        }
    });

    const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({ control, name: "visibletestCases" });
    const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({ control, name: "hiddentestCases" });

    const onSubmit = async (data) => {
        setFormStatus({ message: '', type: '' });
        try {
            await axiosclient.post('/problem/create', data);
            setFormStatus({ message: 'Problem created successfully!', type: 'success' });
        } catch (error) {
            console.error("ERROR: ", error);
            setFormStatus({ message: error.response?.data?.message || 'An error occurred.', type: 'error' });
        }
    };

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } };

    return (
        <div className="min-h-screen bg-base-100 p-4 sm:p-6 md:p-8 font-sans">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-base-100 via-base-200/5 to-base-100 -z-10"></div>
            
            <div className="max-w-5xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Create a New Problem
                    </h1>
                    <p className="text-base-content/70 text-lg">Build the next great challenge for our community.</p>
                </motion.div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <motion.div className="space-y-10" variants={containerVariants} initial="hidden" animate="visible">
                        
                        {/* --- Basic Information --- */}
                        <motion.div variants={itemVariants}>
                            <FormSection title="Basic Information" icon={<FileText size={24} />}>
                                <div className="form-control">
                                    <label className="label font-semibold">Title</label>
                                    <input className={`input input-bordered w-full focus:ring-2 focus:ring-primary ${errors.title ? 'input-error' : ''}`} {...register('title')} />
                                    {errors.title && <span className="text-error text-sm mt-1">{errors.title.message}</span>}
                                </div>
                                <div className="form-control">
                                    <label className="label font-semibold">Description</label>
                                    <textarea className={`textarea textarea-bordered h-24 w-full focus:ring-2 focus:ring-primary ${errors.description ? 'textarea-error' : ''}`} {...register('description')} />
                                    {errors.description && <span className="text-error text-sm mt-1">{errors.description.message}</span>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-control">
                                        <label className="label font-semibold">Difficulty</label>
                                        <select className={`select select-bordered w-full focus:ring-2 focus:ring-primary ${errors.difficulty ? 'select-error' : ''}`} {...register("difficulty")}>
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                    </div>
                                    <div className="form-control">
                                        <label className="label font-semibold">Tag</label>
                                        <select className={`select select-bordered w-full focus:ring-2 focus:ring-primary ${errors.tags ? 'select-error' : ''}`} {...register("tags")}>
                                            <option value="array">Array</option>
                                            <option value="linked list">Linked List</option>
                                            <option value="DP">DP</option>
                                            <option value="graph">Graph</option>
                                        </select>
                                    </div>
                                </div>
                            </FormSection>
                        </motion.div>
                        
                        {/* --- Test Cases --- */}
                        <motion.div variants={itemVariants}>
                            <FormSection title="Test Cases" icon={<ListChecks size={24} />}>
                                {/* Visible Test Cases */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-lg">Visible Test Cases</h3>
                                        <button type="button" onClick={() => appendVisible({ input: '', Output: '', explanation: '' })} className="btn btn-primary btn-sm"><PlusCircle size={16} className="mr-1"/> Add Visible</button>
                                    </div>
                                    {visibleFields.map((field, index) => (
                                        <div key={field.id} className="p-4 border border-base-300/50 rounded-lg bg-base-100 relative group">
                                            <button type="button" onClick={() => removeVisible(index)} className="btn btn-xs btn-circle btn-ghost absolute top-3 right-3 text-base-content/50 hover:bg-error hover:text-white"><Trash2 size={16}/></button>
                                            <h4 className="font-semibold mb-2">Case #{index + 1}</h4>
                                            <div className="space-y-2">
                                                <textarea {...register(`visibletestCases.${index}.input`)} className="textarea textarea-bordered w-full text-sm" placeholder="Input" rows={2}/>
                                                <textarea {...register(`visibletestCases.${index}.Output`)} className="textarea textarea-bordered w-full text-sm" placeholder="Output" rows={2}/>
                                                <textarea {...register(`visibletestCases.${index}.explanation`)} className="textarea textarea-bordered w-full text-sm" placeholder="Explanation"/>
                                            </div>
                                        </div>
                                    ))}
                                    {errors.visibletestCases && <span className="text-error text-sm mt-1">{errors.visibletestCases.message || errors.visibletestCases.root?.message}</span>}
                                </div>
                                <div className="divider"></div>
                                {/* Hidden Test Cases */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-lg">Hidden Test Cases</h3>
                                        <button type="button" onClick={() => appendHidden({ input: '', Output: '', explanation: '' })} className="btn btn-accent btn-sm"><PlusCircle size={16} className="mr-1"/> Add Hidden</button>
                                    </div>
                                    {hiddenFields.map((field, index) => (
                                        <div key={field.id} className="p-4 border border-base-300/50 rounded-lg bg-base-100 relative group">
                                             <button type="button" onClick={() => removeHidden(index)} className="btn btn-xs btn-circle btn-ghost absolute top-3 right-3 text-base-content/50 hover:bg-error hover:text-white"><Trash2 size={16}/></button>
                                             <h4 className="font-semibold mb-2">Case #{index + 1}</h4>
                                             <div className="space-y-2">
                                                <textarea {...register(`hiddentestCases.${index}.input`)} className="textarea textarea-bordered w-full text-sm" placeholder="Input" rows={2}/>
                                                <textarea {...register(`hiddentestCases.${index}.Output`)} className="textarea textarea-bordered w-full text-sm" placeholder="Output" rows={2}/>
                                                <textarea {...register(`hiddentestCases.${index}.explanation`)} className="textarea textarea-bordered w-full text-sm" placeholder="Explanation"/>
                                             </div>
                                        </div>
                                    ))}
                                    {errors.hiddentestCases && <span className="text-error text-sm mt-1">{errors.hiddentestCases.message || errors.hiddentestCases.root?.message}</span>}
                                </div>
                            </FormSection>
                        </motion.div>

                        {/* --- Code & Solutions --- */}
                        <motion.div variants={itemVariants}>
                            <FormSection title="Code & Solutions" icon={<Code2 size={24} />}>
                                <div role="tablist" className="tabs tabs-lifted">
                                    {['C++', 'Java', 'JavaScript'].map((lang, index) => (
                                        <a key={index} role="tab" className={`tab ${activeTab === index ? 'tab-active' : ''}`} onClick={() => setActiveTab(index)}>{lang}</a>
                                    ))}
                                </div>
                                <div className="bg-base-100 p-4 rounded-b-box">
                                    {['C++', 'Java', 'JavaScript'].map((lang, index) => (
                                        <div key={index} className={`${activeTab === index ? 'block' : 'hidden'}`}>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                <div className="form-control">
                                                    <label className="label font-semibold">Starter Code</label>
                                                    <div className="bg-base-300 rounded-lg p-1">
                                                        <textarea {...register(`startcode.${index}.initialcode`)} className="w-full bg-transparent text-base-content font-mono h-48 resize-y p-3" />
                                                    </div>
                                                     {errors.startcode?.[index]?.initialcode && <span className="text-error text-sm mt-1">{errors.startcode[index].initialcode.message}</span>}
                                                </div>
                                                <div className="form-control">
                                                    <label className="label font-semibold">Reference Solution</label>
                                                     <div className="bg-base-300 rounded-lg p-1">
                                                        <textarea {...register(`referencesolution.${index}.completeCode`)} className="w-full bg-transparent text-base-content font-mono h-48 resize-y p-3" />
                                                    </div>
                                                    {errors.referencesolution?.[index]?.completeCode && <span className="text-error text-sm mt-1">{errors.referencesolution[index].completeCode.message}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </FormSection>
                        </motion.div>

                        <motion.div variants={itemVariants} className="pt-4 space-y-4">
                            {formStatus.message && (
                                <div role="alert" className={`alert ${formStatus.type === 'success' ? 'alert-success' : 'alert-error'} text-white shadow-lg`}>
                                    {formStatus.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
                                    <span>{formStatus.message}</span>
                                </div>
                            )}
                            <div className="flex justify-end pt-4">
                                <button type="submit" className="btn btn-primary btn-lg shadow-lg hover:shadow-primary/30" disabled={isSubmitting}>
                                    {isSubmitting ? <span className="loading loading-spinner"></span> : <><Save size={20} className="mr-2"/> Create Problem</>}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </form>
            </div>
        </div>
    );
}

export default Adminpanel;
