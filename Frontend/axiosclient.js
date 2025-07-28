import axios from "axios"

const axiosclient = axios.create({

    baseURL:'https://leetcode-project-backend.vercel.app',
    withCredentials:true,
    headers:{
        'Content-Type':'application/json'
    }
})

export default axiosclient; 
