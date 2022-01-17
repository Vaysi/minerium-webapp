import axios, { AxiosInstance, AxiosRequestConfig,Method } from 'axios';
import env from "./env";

const axiosConfig:AxiosRequestConfig = {
    baseURL: env.API_URL,
};

const instance:AxiosInstance = axios.create(axiosConfig);

const {POST,GET} = {POST:"POST",GET:"GET"};

const routes = {
    users: {
        login: {
            route: "users/login",
            method: POST
        },
        register: {
            route: "users/register",
            method: POST
        },
        reset: {
            route: "users/reset-password",
            method: POST
        },
    }
}

const $$userLogin = (identifier:string,password:string) => {
    return instance.request({
        method: routes.users.login.method as Method,
        url: routes.users.login.route,
        data: {
            identifier,
            password
        }
    }).then(response => response.data);
}

export {
    $$userLogin
};