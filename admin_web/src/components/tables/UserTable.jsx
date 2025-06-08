import React from 'react';
import { Link } from 'react-router-dom';
import './styles/UserTable.scss'
function UserTable({ currentUsers, onEdit, onDelete }) {
    return (
        <table className="user-table">
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Phone number</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Date created</th>
                    <th>Date updated</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {currentUsers.map((user) => (
                    <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.phoneNumber}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{new Date(user.createdAt).toLocaleString()}</td>
                        <td>{new Date(user.updatedAt).toLocaleString()}</td>
                        <td>
                            <button onClick={() => onEdit(user)} className="edit-button">Edit</button>
                            <button onClick={() => onDelete(user.id)} className="delete-button">Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default UserTable;
