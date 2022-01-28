import axios, { AxiosInstance, AxiosRequestConfig,Method } from 'axios';
import env from "./env";
import { IAuthTokens, TokenRefreshRequest, applyAuthTokenInterceptor } from 'axios-jwt'
import {toast} from "react-toastify";

const axiosConfig:AxiosRequestConfig = {
    baseURL: env.API_URL,
};

const instance:AxiosInstance = axios.create(axiosConfig);

const requestRefresh: TokenRefreshRequest = async (refreshToken: string): Promise<IAuthTokens | string> => {
    return refreshToken;
}

applyAuthTokenInterceptor(instance,{requestRefresh});

instance.interceptors.response.use((response) => response, (error) => {
    toast.error('Something Went Wrong , Please Try Again or Call The Support Team');
    throw error;
});


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
    },
    workers: {
        list: {
            route: "workers",
            method: GET,
        },
        byGroup: {
            route: "workers/groups/:groupId",
            method: GET
        },
        groupList: {
            route: "workers/groups",
            method: GET
        },
        createGroup: {
            route: "workers/groups",
            method: POST
        }
    },
    watchers: {
        create:{
            route: "watchers",
            method: POST
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

const $$workersList = (groupId:Number|null|string = null) => {
    let method = groupId != null ? routes.workers.byGroup.method : routes.workers.list.method;
    let route = groupId != null ? routes.workers.byGroup.route.replace(":groupId",String(groupId)) : routes.workers.list.route;
    return instance.request({
        method: method as Method,
        url: route,
        params: {
            since: 2
        }
    }).then(response => response.data).catch(error => {
        throw error.response.data;
    });
}

const $$workersGroups = () => {
    return instance.request({
        method: routes.workers.groupList.method as Method,
        url: routes.workers.groupList.route,
    }).then(response => response.data).catch(error => {
        throw error.response.data;
    });
}

const $$createWorkerGroup = (name:string,workers:Array<any>) => {
    return instance.request({
        method: routes.workers.createGroup.method as Method,
        url: routes.workers.createGroup.route,
        data: {
            name,
            workers
        }
    }).then(response => response.data).catch(error => {
        throw error.response.data;
    });
}

const $$createWatcher = (name:string,workerGroupId:number|string) => {
    return instance.request({
        method: routes.watchers.create.method as Method,
        url: routes.watchers.create.route,
        data: {
            name,
            workerGroupId
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
    $$paymentHistory,
    $$workersList,
    $$workersGroups,
    $$createWorkerGroup,
    $$createWatcher
};