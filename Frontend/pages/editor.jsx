import { useState,useEffect } from "react";
import {Editor}from "@monaco-editor/react"

function Editorpage(){
    const[language,setlanguage] = useState("cpp");
    const[theme,settheme]=useState("vs");
    const[code,setcode]=useState('')
    const[coderun,setcoderun]=useState(false);

const languages = {
    cpp: {
      name: 'C++',
      monacoLanguage: 'cpp',
      template: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}`
    },
    java: {
      name: 'Java',
      monacoLanguage: 'java',
      template: `public class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`
    },
    javascript: {
      name: 'JavaScript',
      monacoLanguage: 'javascript',
      template: `// Your code here\nfunction solution(input) {\n    // Implement your solution here\n}`
    }
  };

// useEffect(()=>{
// setcode(languages[lang].template)
// },[lang])


return(
    <>
   <div className="flex flex-col h-full">
<div className="flex justify-between items-center bg-base-200 p-2">
<div className="flex items-center space-x-4">
    <select className="select select-bordered select-sm" value={language} 
    onChange={(e)=>setlanguage(e.target.value)}>

   {Object.entries(languages).map(([key,val])=>(
    <option key={key} value={val.monacoLanguage}>{val.name}</option>

   ))}
    </select>
<select className="select select-bordered select-sm" value={theme}  onChange={(e)=>settheme(e.target.value)}>
    <option value="vs">Light</option>
    <option value="vs-dark">Dark</option>
    <option value="hc-black">High contrast</option>
</select>

</div>

<div className="flex space-x-2">
    <button className="btn btn-primary" >Run Code</button>
    </div>
<div className="btn btn-success btn-sm">Submit</div>

</div>

<div className="flex-grow">
<Editor 

      height="100vh"
      language={languages[language].monacoLanguage}
      theme={theme}
       options={{
        minimap:{enabled:true},
        value:{code},
        fontSize:14,
        scrollBeyondLastLine:false,
        automaticLayout:true,
        tabSize:2,
        wordWrap:"on",
        folding:true,
        lineNumbers:"on",
        glyphMargin:true

      }}



/>
</div>




    </div> 
    
    
    
    
    
    
    
    </>
)











}
export default Editorpage;