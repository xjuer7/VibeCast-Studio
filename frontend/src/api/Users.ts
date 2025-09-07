import axios from "axios"

interface User {
    username: string,
    password: string,
}

interface ApiDataReg {
    user?: { 
        username: string,
    },
    message: string
}
interface ApiDataLog {
    token?: string;
    message: string
}
interface LocalData {
    token: string;
    username: string;
}

export const baseURL = `http://localhost:8000`;
export const apiURL = `${baseURL}/api`;

export const authUser = <T extends ApiDataReg | ApiDataLog>(url:string, name: string, password: string):Promise<T>  => {
    const obj:User = {
        username: name,
        password: password
    }

    return axios.post(`${apiURL}${url}`, obj, {
        headers: {
            'Content-Type': "application/json",
        }
    })
    .then((response) => {
        const data =  response.data;

        if('user' in data) {
            const regData: T | ApiDataReg = {
                user: {username: data.user.username},
                message: data.message
            };
            return regData as T
        } else {
            const logData: T | ApiDataLog = {
                token: data.token,
                message: data.message
            };

            const dataLocal:LocalData = {
                token: data.token,
                username: name
            }
            localStorage.setItem('user', JSON.stringify(dataLocal))
            return logData as T
        }

    })
    .catch((error) => {
        if(error.response) {
            return error.response.data as T
        }
        throw error;
    })
}