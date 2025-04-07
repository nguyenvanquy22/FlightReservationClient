import React, { useState, useContext } from "react";
import axios from "axios";
import './ChangePassword.scss';
import { StoreContext } from "../../../context/StoreContext";
import bcrypt from 'bcryptjs';

const ChangePassword = () => {
    const { user, setUser } = useContext(StoreContext); // Get user data from context

    // State for password information
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    let changePassword = true;

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     // Validate input fields
    //     if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
    //         setError("Please fill out all fields.");
    //         return;
    //     }

    //     // Validate current password

    //     // if (user.password !== passwords.currentPassword) {
    //     //     setError("Current password is incorrect.");
    //     //     return;
    //     // }
    //     bcrypt.compare(passwords.currentPassword, user.password, (err, result) => {
    //         console.log('Kết quả:', result);
    //         console.log('Mk cũ', user.password, 'Mk nhập:', passwords.currentPassword);
    //         if (result === false) {
    //           console.error('Error during password comparison:', err);
    //           setError('An error occurred while checking the password.');
    //           changePassword = false;
    //           return;
    //         }

          
    //         console.log('Kết quả:', 'Khớp');
    //         // Tiếp tục xử lý khi mật khẩu khớp
    //       });
          
          
    //     // Check new password and confirmation match
    //     if (passwords.newPassword !== passwords.confirmPassword) {
    //         setError("New password and confirmation do not match.");
    //         return;
    //     }

    //     // Update user information with the new password
    //     const updatedUser = {
    //         ...user,
    //         password: passwords.newPassword // Only update the password
    //     };

    //     if(changePassword == true) {
    //         try {
    //             // Send PUT request to update password
    //             const response = await axios.put(`http://localhost:8080/api/users/${user.id}`, updatedUser,
    //                 { headers: { "Authorization": `Bearer ${localStorage.getItem("customerToken")}` } }
    //             );
    //             // On success, display success message
    //             setSuccessMessage("Password changed successfully.");
    //             setShowPasswords({
    //                 current: false,
    //                 new: false,
    //                 confirm: false,
    //             });
    //             setError(""); // Clear any error
    
    //             // Update user in context after successful password change
    //             setUser(updatedUser);
    //         } catch (error) {
    //             const serverError = error.response?.data?.message || "An error occurred while changing the password.";
    //             setError(serverError);
    //             console.error("Error details:", error.response?.data);
    //         }
    //     }

    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validate input fields
        if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
            setError("Please fill out all fields.");
            return;
        }
    
        // Check new password and confirmation match
        if (passwords.newPassword !== passwords.confirmPassword) {
            setError("New password and confirmation do not match.");
            return;
        }
    
        // Validate current password using bcrypt
        bcrypt.compare(passwords.currentPassword, user.password, async (err, result) => {
            if (err) {
                console.error('Error during password comparison:', err);
                setError('An error occurred while checking the password.');
                return;
            }
    
            if (!result) {
                setError("Current password is incorrect.");
                return;
            }
    
            console.log('Password matched. Proceeding to update.');
    
            // If password matches, update user information
            const updatedUser = {
                ...user,
                password: passwords.newPassword, // Update only the password
            };
    
            try {
                // Send PUT request to update password
                const response = await axios.put(
                    `http://localhost:8080/api/users/${user.id}`,
                    updatedUser,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("customerToken")}`,
                        },
                    }
                );
    
                setSuccessMessage("Password changed successfully.");
                setError(""); // Clear any error
    
                // Update user in context
                setUser(updatedUser);
    
                // Clear password fields
                setPasswords({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            } catch (error) {
                const serverError = error.response?.data?.message || "An error occurred while changing the password.";
                setError(serverError);
                console.error("Error details:", error.response?.data);
            }
        });
    };
    

    let isLoggedIn = false;
    if (localStorage.getItem('userId')) {
        isLoggedIn = true;
    }
    if (!isLoggedIn) {
        return (
            <div className="change-password-page">
                <h2>Change Password</h2>
                <div className="error-message">Please log in to change your password.</div>
            </div>
        );
    }

    return (

        <div className="change-password-page">
            <h2>Change Password</h2>
            <form id="change-password-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <div className="password-wrapper">
                        <input
                            type={showPasswords.current ? "text" : "password"}
                            name="currentPassword"
                            placeholder="Enter current password"
                            value={passwords.currentPassword}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => togglePasswordVisibility("current")}
                        >
                            {showPasswords.current ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <div className="password-wrapper">
                        <input
                            type={showPasswords.new ? "text" : "password"}
                            name="newPassword"
                            placeholder="Enter new password"
                            value={passwords.newPassword}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => togglePasswordVisibility("new")}
                        >
                            {showPasswords.new ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <div className="password-wrapper">
                        <input
                            type={showPasswords.confirm ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm new password"
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => togglePasswordVisibility("confirm")}
                        >
                            {showPasswords.confirm ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                <button type="submit" className="change-password-btn">Change Password</button>
            </form>
        </div>
    );
};

export default ChangePassword;
