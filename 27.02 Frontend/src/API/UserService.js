import axios from "axios";

console.log("VITE_BASE_URL:", import.meta.env.VITE_BASE_URL);
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5088/api/account";

export default class UserService {
    static async registration(user) {
        const { username, realname, email, password } = user;
        console.log("Register request to:", `${import.meta.env.VITE_BASE_URL}/api/account/register`, user);

        const {data} = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/account/register`, {
            username,
            email,
            realname,
            password
        });
        return data;
    }

    static async login(user) {
        const { email, password } = user;   // Login expects email and password
        console.log("Login request to:", `${import.meta.env.VITE_BASE_URL}/api/account/login`, user);

        const {data} = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/account/login`, {
            email,
            password
        });
        return data;
    }

    static logout() {
        localStorage.removeItem('token');
    }
}