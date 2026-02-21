import axios from "axios";
import {BASE_URL} from "./apiPaths"

const axoisInstance = axios.create({
    baseURL:BASE_URL,
    timeout:10000,
    headers:{
        "Content-Type":"application/json",
        Accept:"application/json",
    }
});

//request interceptor
axoisInstance.interceptors.request.use(
    (config)=>{
        const accessToken = localStorage.getItem("token");
        if(accessToken){
            config.headers.Authorization=`Bearer ${accessToken}`
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error)
    }
)

//response interceptor
axoisInstance.interceptors.response.use(
    (response)=>{
        return response;
    },
    (error)=>{
        //handle common error globally
        if(error.response){
            if(error.response.status===401){
                //redirect to login
                window.location.href='/login'
            }else if(error.response.status===500){
                console.error("Server error please try again later")
            }else if(error.code == "ENCANNABORTED"){
                console.error("Requrest timeout, please try again")
            }

            return Promise.reject(error)
        }
    }
)

export default axoisInstance;