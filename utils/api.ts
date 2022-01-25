import axios, { AxiosInstance, AxiosRequestConfig,Method } from 'axios';
import env from "./env";
import { IAuthTokens, TokenRefreshRequest, applyAuthTokenInterceptor } from 'axios-jwt'

const axiosConfig:AxiosRequestConfig = {
    baseURL: env.API_URL,
};

const instance:AxiosInstance = axios.create(axiosConfig);

const requestRefresh: TokenRefreshRequest = async (refreshToken: string): Promise<IAuthTokens | string> => {
    return refreshToken;
}

applyAuthTokenInterceptor(instance,{requestRefresh});


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
    },
    earnings: {
        balance: {
            route: "earnings/balance",
            method: GET
        },
        history: {
            route: "earnings",
            method: GET
        },
        paymentHistory: {
            route: "earnings/payment-history",
            method: GET
        }
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
    }).then(response => response.data).catch(error => {
        throw error.response.data;
    });
}

const $$userRegister = (email:string,password:string,repeat_password:string,username:string) => {
    return instance.request({
        method: routes.users.register.method as Method,
        url: routes.users.register.route,
        data: {
            email,
            username,
            password,
            repeat_password
        }
    }).then(response => response.data).catch(error => {
        throw error.response.data;
    });
}

const $$earningsBalance = () => {
    return instance.request({
        method: routes.earnings.balance.method as Method,
        url: routes.earnings.balance.route
    }).then(response => response.data).catch(error => {
        throw error.response.data;
    });
}

const $$earningsHistory = () => {
    return instance.request({
        method: routes.earnings.history.method as Method,
        url: routes.earnings.history.route
    }).then(response => response.data).catch(error => {
        throw error.response.data;
    });
}

const $$paymentHistory = () => {
    return instance.request({
        method: routes.earnings.paymentHistory.method as Method,
        url: routes.earnings.paymentHistory.route,
        params: {
            coin: "all"
        }
    }).then(response => response.data).catch(error => {
        throw error.response.data;
    });
}
export {
    $$userLogin,
    $$userRegister,
    $$earningsBalance,
    $$earningsHistory,
    $$paymentHistory
};