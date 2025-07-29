import axios from "axios"

const axiosclient = axios.create({

    baseURL:'https://leetcode-project-backend-3s5d.onrender.com',
    withCredentials:true,
    headers:{
        'Content-Type':'application/json'
    }
})

export default axiosclient; 
