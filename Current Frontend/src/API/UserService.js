import axios from "axios";

console.log("VITE_BASE_URL:", import.meta.env.VITE_BASE_URL);
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5088/api/account";

export default class UserService {
    //Register functionality
    static async registration(user) {
        const { username, realname, email, password } = user;
        console.log("Register request to:", `${import.meta.env.VITE_BASE_URL}/api/account/register`, user);

        const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/account/register`, {
            username,
            email,
            realname,
            password
        });
        return data;
    }

    //Login functionality
    static async login(user) {
        const { email, password } = user;   // Login expects email and password
        console.log("Login request to:", `${import.meta.env.VITE_BASE_URL}/api/account/login`, user);

        const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/account/login`, {
            email,
            password
        });

        //Stores email and token in local storage upon successful login
        localStorage.setItem('email', data.email);
        console.log("Received Token: ", data.token);
        localStorage.setItem('token', data.token);

        return data;
    }

    //Get user profile functionality for correct profile page display
    static async getProfile() {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error("No token found. User must be logged in.");
        }

        try {
            // Make a request to fetch the profile
            const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/account/profile`, {
                headers: {
                    Authorization: `Bearer ${token}` // Sends the token in request
                }
            });
            return data;
        } catch (error) {
            console.error("Error fetching profile:", error);
            throw error;
        }
    }

    //Logout functionality
    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
    }
}