import axios from "axios";

export default class UserService {
    static async registration(user) {
        const { username, realname, email, password } = user;
        const data = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/account/register`, {
            username,
            email,
            realname,
            password
        })
        return data
    }

    static async login(user) {
        const { email, password } = user;
        const data = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/account/login`, {
            email,
            password
        })
        return data
    }

    static logout() {
        localStorage.removeItem('token');
    }
}