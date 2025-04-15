import React, { useState } from 'react';
import './styles/UserForm.scss';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const UserForm = ({
    formType,
    formData,
    onChange,
    onSubmit,
    onCancel,
    errorMessage = {}
}) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <h3>{formType === "add" ? "Add User" : "Edit User"}</h3>
                <form onSubmit={onSubmit}>
                    {/* <div className="form-group">
                        <label>First Name:</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={onChange}
                            placeholder="First Name"
                            required
                        />
                        {errorMessage.firstName && (
                            <span className="error">{errorMessage.firstName}</span>
                        )}
                    </div>
                    <div className="form-group">
                        <label>Last Name:</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={onChange}
                            placeholder="Last Name"
                            required
                        />
                        {errorMessage.lastName && (
                            <span className="error">{errorMessage.lastName}</span>
                        )}
                    </div> */}
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={onChange}
                            placeholder="Email"
                            required
                            readOnly={formType === "edit"} // Không cho phép thay đổi khi edit
                        />
                        {errorMessage.email && (
                            <span className="error">{errorMessage.email}</span>
                        )}
                    </div>
                    {formType === "add" && ( // Ẩn trường password khi là edit
                        <div className="form-group password-container">
                            <label>Password:</label>
                            <input
                                type={"password"}
                                name="password"
                                value={formData.password}
                                onChange={onChange}
                                placeholder="Password"
                                required
                            />
                            {errorMessage.password && (
                                <span className="error">{errorMessage.password}</span>
                            )}
                        </div>
                    )}
                    <div className="form-group">
                        <label>Role:</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={onChange}
                            required
                        >
                            <option value="CUSTOMER">CUSTOMER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                        {errorMessage.role && (
                            <span className="error">{errorMessage.role}</span>
                        )}
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="submit-button">
                            {formType === "add" ? "Add User" : "Save Changes"}
                        </button>
                        <button type="button" onClick={onCancel} className="cancel-button">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
