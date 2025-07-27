// import { useState,useEffect,useRef } from "react";
// import { useForm } from "react-hook-form";
// import axiosclient from "../axiosclient";
// import {Send} from "lucide-react";


// function ChatAI({problem})
 
// {


// const[message,setmessage] = useState([

//     {role:"model",parts:[{text:"Hey! I am your AI chatbot? How can I help you"}]},
// ])

// const {register,handleSubmit,reset,formState:{errors}} = useForm();

// const messageendRef = useRef(null);

// useEffect(()=>{

//     messageendRef.current?.scrollIntoView({behavior:"smooth"})
    
// },[message])

// const onSubmit = async(data)=>{
//     setmessage(prev=>[...prev,
//         {role:"user",parts:[{text:data.message}]}, ])
    
//     reset();

//     try{

//   const response=await axiosclient.post("/ai/chat",{
//           message:message,
//           title:problem.title,
//           description:problem.description,
//           testcases:problem.visibletestCases, 
//           startcode:problem.startcode})
          
//           console.log(message)


//   setmessage(prev => [...prev, {
//         role: "model",
//         parts: [{ text: response.data.message }]
//       }]);
//     }
//     catch(error){
//         console.error("Api Error:",error)
//         setmessage(prev=>[...prev,{
//             role:"model",
//             parts:[{text:"Error from chatbot"}]
//         }])
//     }

// }

// return(
//     <>
//     <div className="flex flex-col-h-screen max-h-[80vh] min-h-[500px]">

//         <div className="flex-1 overflow-y-auto p-4 space-y-4">

//             {message.map((msg,index)=>(

//                 <div key={index} className={`chat ${msg.role==="user"? "chat-end": "chat-start"}`}>

//              <div className="chat-bubble bg-base-200 base-content">{msg.parts[0].text}</div> 
//              </div>              
//             ))}

            

//         <div ref={messageendRef}>
//             <form onSubmit={handleSubmit(onSubmit)} className="sticky bottom-0 p-4 bg-base-100 border-t">

//                 <div className="flex items-center">
//                     <input placeholder="Ask me anything" className="input input-bordered flex-1"
//                     {...register("message",{required:true,minLength:2})} />
//                     <button type="Submit" className="btn btn-ghost mt-2"><Send size={20}/></button>
//                 </div>
//             </form>
//         </div>





//         </div>



//     </div>
    
    
    
//     </>
// )





// }

// export default ChatAI;

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import axiosclient from "../axiosclient";
import { Send, Bot, User, CornerDownLeft } from "lucide-react";

function ChatAI({ problem }) {

  const [message, setMessage] = useState([
    {
      role: "model",
      parts: [{ text: "Hey! I am your AI chatbot. How can I help you?" }],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const onSubmit = async (data) => {
    setMessage((prev) => [
      ...prev,
      { role: "user", parts: [{ text: data.message }] },
    ]);
    setIsTyping(true);
    reset();

    try {
      const response = await axiosclient.post("/ai/chat", {
        message: message,
        title: problem.title,
        description: problem.description,
        testcases: problem.visibletestCases,
        startcode: problem.startcode,
      });

      setMessage((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: response.data.message }],
        },
      ]);
    } catch (error) {
      console.error("Api Error:", error);
      setMessage((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: "Oops! Something went wrong. Please try again." }],
          error: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh] min-h-[500px] bg-base-100 text-base-content font-mono">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {message.map((msg, index) => (
          <div
            key={index}
            className={`chat ${
              msg.role === "user" ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
             
              <div className="w-10 rounded-full bg-gray-700/80 flex items-center justify-center">
                {msg.role === "user" ? (
                  <User size={20} className="text-base-content" />
                ) : (
                  <Bot size={20} className="text-yellow-400" />
                )}
              </div>
            </div>
            <div
              className={`chat-bubble ${
                msg.role === "user"
                  ? "bg-gray-700/80 text-base-content"
                  : "bg-base-100 text-base-content"
              } ${msg.error ? "bg-red-500/20 text-red-400" : ""}`}
            >
              {msg.parts[0].text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="chat chat-start">
            <div className="chat-image avatar">
               {/* FIX: Added flex, items-center, and justify-center to center the icon */}
              <div className="w-10 rounded-full bg-gray-700/80 flex items-center justify-center">
                <Bot size={20} className="text-yellow-400" />
              </div>
            </div>
            <div className="chat-bubble bg-base-100 text-base-content">
              <span className="loading loading-dots loading-md"></span>
            </div>
          </div>
        )}

        <div ref={messageEndRef}></div>
      </div>

      <div className="p-4 bg-base-100 border-t border-gray-700/50">
        <form onSubmit={handleSubmit(onSubmit)} className="relative">
          <input
            placeholder="Ask me anything..."
            className="input input-bordered w-full bg-base-100 border-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-500 pr-12"
            {...register("message", { required: true, minLength: 2 })}
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-yellow-400"
            disabled={isTyping}
          >
            <Send size={20} />
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
          <CornerDownLeft size={12} /> Press Enter to send
        </p>
      </div>
    </div>
  );
}

export default ChatAI;










