import axios from "axios"

const axiosclient = axios.create({

    baseURL:'https://leetcode-project-pearl.vercel.app',
    withCredentials:true,
    headers:{
        'Content-Type':'application/json'
    }
})

export default axiosclient; 
