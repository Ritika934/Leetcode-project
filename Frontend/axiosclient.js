import axios from "axios"

const axiosclient = axios.create({

    baseURL:'https://leetcode-project-4.onrender.com/',
    withCredentials:true,
    headers:{
        'Content-Type':'application/json'
    }
})

export default axiosclient; 
