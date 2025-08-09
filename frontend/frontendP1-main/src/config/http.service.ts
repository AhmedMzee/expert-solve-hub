import axios from "axios";

axios.interceptors.request.use(
    (config) => {
     const token = localStorage.getItem("token")
     if(token){
        console.log("this is my token ", token)
        config.headers['Authorization'] = `Bearer ${token}`
     }
     return config
    },
    (error) =>{

    }
);

export default {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete:axios.delete
}