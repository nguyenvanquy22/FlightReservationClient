import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./LoginPopup.scss";
import { SERVER_API } from '../../config'

const LoginPopup = ({ setShowLogin }) => {

    const { setToken, token, user, fetchUser } = useContext(StoreContext);
    const [currState, setCurrState] = useState('Login');

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [register, setRegister] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        role: "CUSTOMER"
    });
    const [error, setError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Reset error trước khi gửi yêu cầu

        if (currState === "Login") {
            try {
                const response = await fetch(`${SERVER_API}/api/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        password
                    }),
                });

                if (!response.ok) {
                    setError("Invalid username or password.");
                    return;
                }

                const data = await response.json();

                console.log(data)

                localStorage.setItem("customerToken", data.token);
                localStorage.setItem("userId", data.user.id);
                setToken(data.token);
                setIsLoggedIn(true);
                setShowLogin(false);
                setUsername("");
                setPassword("");
                setError("");
                navigate("/");

            } catch (error) {
                setError("Server error. Please try again later.");
            }
        } else {
            try {
                const response = await fetch(`${SERVER_API}/api/auth/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(register),
                });

                console.log(register)

                if (!response.ok) {
                    setError("Failed to register. Please try again.");
                    return;
                }

                window.alert(`Register successfully, please return to "Login" !`);

                const data = await response.json();


            } catch (error) {
                setError("Server error. Please try again later.");
            }
        }
    };

    return (
        <div className="login-container">
            {!isLoggedIn && (
                currState === "Login" ? (
                    <form className="login-form" onSubmit={handleLogin}>
                        <h2 className="login-title">{currState}</h2>
                        <button className="close-button" onClick={() => setShowLogin(false)}>X</button>
                        {error && <p className="error-message">{error}</p>}
                        <div className="form-group">
                            <label htmlFor="username" className="label">Username:</label>
                            <input
                                type="text"
                                id="username"
                                className="input"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="label">Password:</label>
                            <div className="password-wrapper">
                                <input
                                    type="password"
                                    id="password"
                                    className="input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <p className="signup_login">
                            Create a new account?
                            <span onClick={() => setCurrState("Sign up")}>Sign up</span>
                        </p>
                        <button type="submit" className="login-button">Login</button>
                    </form>
                ) : (
                    <form className="login-form" onSubmit={handleLogin}>
                        <h2 className="login-title">{currState}</h2>
                        <button className="close-button" onClick={() => setShowLogin(false)}>X</button>
                        {error && <p className="error-message">{error}</p>}
                        <div className="form-group">
                            <label htmlFor="email" className="label">Email:</label>
                            <input
                                type="email"
                                id="email"
                                className="input"
                                value={register.email}
                                onChange={(e) => setRegister({ ...register, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="username" className="label">Username:</label>
                            <input
                                type="text"
                                id="username"
                                className="input"
                                value={register.username}
                                onChange={(e) => setRegister({ ...register, username: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="label">Password:</label>
                            <input
                                type="password"
                                id="password"
                                className="input"
                                value={register.password}
                                onChange={(e) => setRegister({ ...register, password: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="firstName" className="label">First Name:</label>
                            <input
                                type="text"
                                id="firstName"
                                className="input"
                                value={register.firstName}
                                onChange={(e) => setRegister({ ...register, firstName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName" className="label">Last Name:</label>
                            <input
                                type="text"
                                id="lastName"
                                className="input"
                                value={register.lastName}
                                onChange={(e) => setRegister({ ...register, lastName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phoneNumber" className="label">Phone Number:</label>
                            <input
                                type="text"
                                id="phoneNumber"
                                className="input"
                                value={register.phoneNumber}
                                onChange={(e) => setRegister({ ...register, phoneNumber: e.target.value })}
                                required
                            />
                        </div>
                        <p className="signup_login">
                            Already have an account?
                            <span onClick={() => setCurrState("Login")}>Login</span>
                        </p>
                        <button type="submit" className="login-button">Register</button>
                    </form>
                )
            )}
        </div>
    );
};

export default LoginPopup;
