import React from 'react';
import './ContactList.scss';
import { Link } from 'react-router-dom';

const ContactList = () => {
    return (
        <div className="contact-list-page">
            <h2>Contact List</h2>
            <table className="contact-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Jane Smith</td>
                        <td>jane.smith@example.com</td>
                        <td>+1234567890</td>
                        <td>
                            <button className="edit-contact">Edit</button>
                            <button className="delete-contact">Delete</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Michael Johnson</td>
                        <td>michael.johnson@example.com</td>
                        <td>+0987654321</td>
                        <td>
                            <button className="edit-contact">Edit</button>
                            <button className="delete-contact">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Link to="/myorder">
            <button className="add-contact">Add Contact</button>
            </Link>
        </div>
    );
};

export default ContactList;
