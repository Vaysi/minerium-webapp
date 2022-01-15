const axios = require('axios').default;
import env from "./env";

const instance = axios.create({
    baseURL: env.API_URL,
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
    }
}

const $$userLogin = () => {
    instance({
        method: routes.users.login.method,
        url: routes.users.login.route
    });
}

export {
    $$userLogin
};