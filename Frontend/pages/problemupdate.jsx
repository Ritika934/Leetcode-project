import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import {useNavigate} from 'react-router'
import axiosclient from "../axiosclient";
import { useParams } from "react-router";
const problemSchema= z.object({
    title: z.string().min(1,"Title is required"),
    description: z.string().min(1,"Description is required"),
    difficulty:z.enum(['easy','medium','hard']),
    tags:z.enum(['array','linked list','DP','graph']),

    visibletestCases: z.array(
        z.object({
            input:z.string().min(1,"Input is required"),
            Output:z.string().min(1,"output is required"),
            explanation:z.string().min(1,"explanation is required")
        })
    ).min(1,"Minimum one test case is required"),

  hiddentestCases:z.array(
        z.object({
            input:z.string().min(1,"Input is required"),
            Output:z.string().min(1,"output is required"),
            explanation:z.string().min(1,"explanation is required")
        })
    ).min(1,"Minimum one test case is required"),

startcode:z.array(
    z.object({
        language:z.enum(["c++","java","javascript"]),
        initialcode:z.string().min(1,"initial code is required")
    })
).length(3,"All languages intial codes are required"),

referencesolution:z.array(
    z.object({
        language:z.enum(["c++","java","javascript"]),
        completeCode:z.string().min(1,"reference solution is required")
    })
).length(3,"All languages reference solution is required")


})
function Problemupdate(){

const {id}=useParams()

const{ register,
handleSubmit,
formState:{errors},control
}=useForm({resolver:zodResolver(problemSchema),

    defaultValues:{
    startcode:[
        {language:"c++",initialcode:''},
        {language:"java",initialcode:''},
        {language:"javascript",initialcode:''}
    ],

  referencesolution:  [
     {language:"c++",completeCode:''},
     {language:"java",completeCode:''},
     {language:"javascript",completeCode:''}

    ]
}
})

const{
    fields:visiblefields,
    append:appendvisible,
    remove:removevisible

}=useFieldArray({
    control,
    name:"visibletestCases"
})
 
const{
    fields:hiddenfields,
    append:appendhidden,
    remove:removehidden
}=useFieldArray({
    control,
    name:"hiddentestCases"
})


const onSubmit=async(data)=>{
    try{
  await  axiosclient.post(`/problem/update/${id}`,data)

  
  alert("Problem updated successfully")
    }
    catch(error){
        console.log("ERROR: "+error)
       alert(error.message) 
    }
}


return(<>
<div className="container mx-auto p-6">
    <h1 className="text-3xl font-bold mb-3 p-2" >Update Problem</h1>

<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

<div className="card shadow-lg base-bg-200 p-6">
    <h2 className="text-xl mb-6 font-semibold">Basic Information</h2>
    <div className="space-y-4">
    <div className="form-control">

 <label className="label">
    <span className="label-text">Title</span>
   </label>

<input className={`input input-bordered ${errors.title && 'input-error'}`}
 {...register('title')}
/>
{errors.title && (<span className="text-error">{errors.title.message}</span>)}


    </div>

<div className="form-control">
<label className="label">
    <span className="label-text">Description</span>
</label>
<input className={`input input-bordered ${errors.description &&'input-error'}`}
{...register('description')}/>
{errors.description && (<span className="text-error"> {errors.description.message}</span>)}
</div>

<div className="flex gap-4">
<div className='form-control w-1/2'>
<label className="label">
    <span className="label-text">Difficulty</span>
</label>
<select className= {`select select-bordered ${errors.difficulty && 'select-error'}`}
{...register("difficulty")}>
<option value="easy">Easy</option>
<option value="medium">Medium</option>
<option value= "hard">Hard</option>
</select>
</div>

<div className="form-control w-1/2">
    <label className="label">
        <span className="label-text">Tag</span>
        </label>
        <select className={`select select-bordered ${errors.tags && 'select-error'}`}
         {...register("tags")}>
            <option value="array">Array</option>
                <option value="Linked list">Linked list</option>
                  <option value="DP">DP</option>
                    <option value="graph">Graph</option>
  
        </select>
    

</div>





</div>
</div>

</div>

<div className="card shadow-lg base-bg-200 p-6">
<h2 className="text-xl font-semibold mb-3 p-2">Test Cases</h2>


<div className="space-y-4">
    {/* for visible test case */}

    <div>
<div className="flex justify-between">
<h3 className="font-medium">Visible test case</h3>
<button type="button" onClick={()=>appendvisible({input:'', Output:'',explanation:''})} className="btn btn-sm btn-primary">
    Add visible test cases</button>

    {visiblefields.map((field,index )=>(
       <>
          <div key={field.id} className="border p-4 rounded-lg space-y-2">
        <div className=" flex justify-end">
            <button type="button" onClick={()=>removevisible(index)} className="btn btn-error">

                 Remove visible test case
                 </button>
        </div>

        <input 
        {...register(`visibletestCases.${index}.input`)}
        className="input input-bordered w-full"
        placeholder="Input visible test cases"
        
        />
        <input
{...register(`visibletestCases.${index}.Output`)}
className="input input-bordered w-full"
placeholder="Output of visble test cases"  />

<textarea
{...register(`visibletestCases.${index}.explanation`)}
className="textarea textarea-bordered w-full"
placeholder="Explanation"
/>
</div>

</>
    ))}

</div>
</div>


{/* hidden test cases */}
<div className="space-y-4 mt-2 flex justify-between items-center">
    <h3 className="font-medium">Hidden test cases</h3>
 <button className="btn btn-primary btn-sm" type="button" onClick={()=>appendhidden({input:'',Output:'',explanation:''})}>Add hidden test cases</button>

{hiddenfields.map((field,index)=>(
   
    <div className="border rounded-lg space-y-2 p-4" key={field.id}>
   <div  className ="flex justify-end">
    <button  type="button"className="btn btn-error" onClick={() => removehidden(index)}
    >Remove test case</button>
</div>
<input  
{...register(`hiddentestCases.${index}.input`)}
className="input input-bordered w-full"  
placeholder="Input hidden test casses"
/>
<input 
{...register(`hiddentestCases.${index}.Output`)}
className="input input-bordered w-full"  
placeholder="Output hidden test casses"
/>

<textarea
{...register(`hiddentestCases.${index}.explanation`)}
className="textarea textarea-bordered w-full"
placeholder="Explanation"
/>






    </div>
))}
</div>

</div>

</div>

<div className="card shadow-lg base-bg-200 p-6">

<h2 className="text-xl font-medium mb-4">Code templates</h2>
<div className="space-y-6">
   {[0,1,2].map((index)=>(
    <>

    <h3 className="font-medium text-xl">{index===0? "C++" : index===1? "Java" : "Javascript"}</h3>
    <div className="form-comtrol">
    <label className="label">
        <span className="label-text">Initial Code</span>
    </label>
    <pre className="bg-base-300 p-4 rounded-lg">
        <textarea 

        {...register(`startcode.${index}.initialcode`)}
        className="w-full bg-transparent font-mono" rows={6}>
            
        </textarea>
        </pre>
        </div>


 <div className="form-comtrol">
    <label className="label">
        <span className="label-text">Reference Solution</span>
    </label>
    <pre className="bg-base-300 p-4 rounded-lg">
        <textarea 
        {...register(`referencesolution.${index}.completeCode`)}
        className="w-full bg-transparent font-mono" rows={6}>
            
        </textarea>
        </pre>
        </div>


        </>
   ))}



</div>
</div>

<button type="submit" className="btn btn-primary w-full">Update Problem</button>

</form>






</div>


</>)

}
export default Problemupdate;