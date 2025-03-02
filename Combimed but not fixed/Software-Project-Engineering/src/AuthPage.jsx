import React from 'react';
import { Link } from 'react-router-dom';
import logo from './assets/logo.svg';
import profile from './assets/profile.svg';
import './Styles.css';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        login: '',
        password: '',
        confirmPassword: '',
        realName: ''
    });

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setFormData({
            username: '',
            login: '',
            password: '',
            confirmPassword: '',
            realName: ''
        });
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
                                    name="realName"
                                    value={formData.realName}
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
                    <button type="submit" className="auth-button">
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
