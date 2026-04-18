import axios from "axios";
import { BASE_URL } from "./apiEndpoints";

//JavaScript library used to make HTTP requests from your frontend or backend.
const axiosConfig = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

//Interceptors so that we do not send out Bearer token everytime when making api calls
//bearer tokens are not needed for login, register, health apis, we can exclude them

const excludeEndpoints = ["/login", "/register", "/status", "/activate", "/health"];

//request interceptor
axiosConfig.interceptors.request.use((config) => {
    const shouldSkipToken = excludeEndpoints.some((endpoint) => {
        config.url?.includes(endpoint);      //boolean
    });

    if (!shouldSkipToken){
        const accessToken = localStorage.getItem("token");
        if (accessToken){
            config.headers.Authorization= `Bearer ${accessToken}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

//response interceptor
axiosConfig.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response){
        if (error.response.status === 401){
            window.location.href = "/login";
        }
        else if (error.response.status === 500){
            console.error("Server error. Please try again later");
        }
    }
    else if (error.code === "ECONNABORTED"){        //connection aborted
        console.error("Request timeout. Please try again.")
    }
    return Promise.reject(error);
});

export default axiosConfig;