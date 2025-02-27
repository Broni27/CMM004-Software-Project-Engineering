import React, {useEffect, useState} from 'react';
import Navbar from './Navbar';
import './Styles.css';
import UserService from "./API/UserService.js";
import {useNavigate} from "react-router-dom";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        login: '',
        password: '',
        confirmPassword: '',
        realname: ''
    });
    const [error, setError] = useState(''); //Adds error state for user validation handling
    const navigate = useNavigate();

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setFormData({
            username: '',
            login: '',
            password: '',
            confirmPassword: '',
            realname: ''
        });
        setError(''); //Resets error state upon toggling between login/register forms
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            console.log('Login:', formData);
        } else {
            if (formData.password !== formData.confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            console.log('Registration:', formData);
        }
    };

    const  handleAuth = async (userData) => {
        console.log(userData);
        if(isLogin) {
            try {
                // Login expects email and password
                const user = await UserService.login(
                    {
                        email: userData.login,          // Sends 'login' as 'email' (backend expects email)
                        password: userData.password,    // Send 'password'  
                    });
                localStorage.setItem('token', user.token);
                localStorage.setItem('username', user.username);
                navigate('/home'); // Redirect after successful login
            } catch (e) {
                //If login fails due to incorrect credentials, displays error message
                if (e.response && e.response.status === 401){
                    setError('Invalid email or password. Please try again.');   //401 is error code for Unauthorised
                } else{
                    setError('An error occured. Please try again later.');      //Cases where other errors occur (likely to be backend issues)
                }
                console.log(e);
            }
        } else {
            try {
                const user = await UserService.registration({...userData, email: userData.login});
                localStorage.setItem('token', user.token);
                localStorage.setItem('username', user.username);
                navigate('/home');
            } catch (e) {
                console.log(e);
            }finally {
                navigate('/home');
            }
        }
    }
    return (
        <>
            <Navbar />

            <div className="auth-container" style={{ marginTop: '70px' }}>
                <h2>{isLogin ? 'Login' : 'Register'}</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <>
                            <div className="input-group">
                                <label htmlFor="username">Username:</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="realName">Real Name:</label>
                                <input
                                    type="text"
                                    id="realName"
                                    name="realname"
                                    value={formData.realname}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </>
                    )}
                    <div className="input-group">
                        <label htmlFor="login">E-mail:</label>
                        <input
                            type="text"
                            id="login"
                            name="login"
                            value={formData.login}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {!isLogin && (
                        <div className="input-group">
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}
                    {/* Show error message if there's an error */}
                    {error && (
                        <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
                            {error}
                        </div>
                    )}
                    <button className="auth-button" onClick={() => handleAuth(formData)}>
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                <button onClick={toggleForm} className="toggle-button">
                    {isLogin ? 'No account? Register!' : 'Have an account? Login!'}
                </button>
            </div>
        </>
    );
};

export default AuthPage;
