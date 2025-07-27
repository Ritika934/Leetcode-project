import {React} from "react"
import {useState} from "react";
import { Trash2,Plus,Edit,Video } from 'lucide-react';
import { NavLink } from "react-router";


function Admin(){

const[selectedoption,setselectedoption] = useState(null)

const adminoptions = [
    {id:"create",
     title:"Create new problem",
     description:"Add new coding problem to your platform",
     icon:Plus,
     color:"btn-success",
     bg_color:"btn-success/10",
     route:"/Admincreate"
    }
,

      {id:"update",
     title:"Update problem",
     description:"Update the existing problem",
     icon:Edit,
     color:"btn-warning",
     bg_color:"btn-warning/10",
     route:"/Adminupdate"
    }
    
 ,
    {id:"delete",
     title:"Delete problem",
     description:"Delete the existing problem",
     icon:Trash2,
     color:"btn-error",
     bg_color:"btn-error/10",
     route:"/Admindelete"
    } ,

    {id:"video",
     title:"Video of problem",
     description:"upload and delete videos",
     icon:Video,
     color:"btn-error",
     bg_color:"btn-error/10",
     route:"/admin/video"
    } 






]

return(<>
<div className="min-h-screen bg-base-200">

<div className="Container mx-auto px-4 py-8">

<div className="text-center mb-12">
    <h1 className="text-4xl font-bold  mb-4 text-base-content">
        Admin Panel
    </h1>
    <p className="text-lg  text-base-content">
        Manage coding problem on your platform
    </p>
</div>


<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

{adminoptions.map((option)=>{
    const Iconcomponent=option.icon;
    return(
<>
<div key={option.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:translate-y-2 cursor-pointer">
    <div className="card-body items-center text-center p-8">
        <div className={`${option.bg_color} p-4 rounded-full mb-4` }>
            <Iconcomponent size={32} className="text-base-content"></Iconcomponent>
            <h2 className="card-title text-xl mb-2">{option.title}</h2>
            <p className="text-base-content/70 mb-6 ">{option.description}</p>
            <div className="card-actions">
                <NavLink to ={option.route} className={`btn ${option.color} btn-wide`}>{option.title}</NavLink>
            </div>
        </div>
    </div>
</div>



</>
    )

})}



</div>


</div>

</div>

</>)















}
export default Admin;