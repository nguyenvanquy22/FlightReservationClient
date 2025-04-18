import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './Users.scss';
import config from "../config.json";
import UserTable from '../../components/tables/UserTable';
import Pagination from '../../components/Pagination/Pagination';
import UserForm from '../../components/form/UserForm';
import { fetchWithToken } from '../fetchWithToken';
import Header from '../../components/header/Header';

const { SERVER_API } = config;

function Users() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState("add"); // "add" hoặc "edit"
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        phoneNumber: "",
        role: "CUSTOMER",
    });
    const [errorMessage, setErrorMessage] = useState("");


    useEffect(() => {
        fetchUsers();
    }, []);


    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetchWithToken(`${SERVER_API}/users`);
            const data = await response.json();
            setUsers(data.data.sort((a, b) => b.id - a.id)); // Sắp xếp giảm dần theo ID
        } catch (error) {
            console.error("Error fetching users:", error);
        }
        setLoading(false);
    };

    const openForm = (type, user = null) => {
        setFormType(type);
        if (type === "edit" && user) {
            setFormData({ ...user }); // Load dữ liệu người dùng khi chỉnh sửa
            setCurrentUser(user);
        } else {
            setFormData({
                email: "",
                firstName: "",
                lastName: "",
                username: "",
                password: "",
                phoneNumber: "",
                role: "CUSTOMER",
            });
            setCurrentUser(null);
        }
        setShowForm(true);
        setErrorMessage("");
    };

    const closeForm = () => {
        setShowForm(false);
        setCurrentUser(null);
        setErrorMessage("");
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const userData = {
            email: formData.get('email')?.trim(),
            password: formData.get('password')?.trim() || (formType === "edit" ? currentUser?.password : ""), // Lấy password từ currentUser nếu form là edit
            role: formData.get('role')?.trim() || "CUSTOMER",
        };

        const errors = {};

        // Validation
        if (!userData.email) {
            errors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
            errors.email = "Please enter a valid email address.";
        }

        if (!userData.role) {
            errors.role = "Role selection is required.";
        }

        const duplicateEmail = users.find(
            (user) => user.email.toLowerCase() === userData.email.toLowerCase() &&
                user.id !== currentUser?.id
        );

        if (duplicateEmail) {
            errors.email = "This email is already in use.";
        }

        const hasChanges = () => {
            if (!currentUser) return true;

            // So sánh từng trường của userData với currentUser
            return (
                userData.email !== currentUser.email ||
                userData.password !== currentUser.password ||
                userData.role !== currentUser.role
            );
        };

        if (!hasChanges) {
            if (userData.password) {
                if (userData.password.length < 5 || userData.password.length > 16) {
                    errors.password = "Password must be between 5 and 16 characters.";
                } else if (!/[a-zA-Z]/.test(userData.password) || !/\d/.test(userData.password)) {
                    errors.password = "Password must contain at least one letter and one number.";
                } else if (/\s/.test(userData.password)) {
                    errors.password = "Password cannot contain spaces.";
                }
            } else {
                errors.password = "Password is required.";
            }
        }

        if (formType === "edit" && !hasChanges()) {
            alert("No changes detected. Please make changes before submitting.");
            return;
        }

        if (Object.keys(errors).length > 0) {
            setErrorMessage(errors);
            return;
        }
        // console.log(userData)
        try {
            let response;
            if (formType === "edit") {
                if (userData.password == currentUser.password) {
                    userData.password = "";
                }
            }
            if (formType === "edit" && currentUser) {

                response = await fetchWithToken(`${SERVER_API}/users/${currentUser.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData),
                });
            } else {
                response = await fetchWithToken(`${SERVER_API}/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData),
                });
            }

            if (response.ok) {
                alert(currentUser ? "User updated successfully" : "User added successfully");
                setErrorMessage([]);
                setShowForm(false);
                fetchUsers();
            } else {
                const errorResponse = await response.json();
                alert(`Failed to submit user data: ${errorResponse.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error submitting user data:', error);
            alert('An error occurred while submitting user data. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {

                const responseBooking = await fetchWithToken(`${SERVER_API}/bookings`);
                if (!responseBooking.ok) {
                    alert("Failed to fetch bookings.");
                    return;
                }
                const bookingData = await responseBooking.json();

                const isUserInBooking = bookingData.data.some((booking) => booking.user.id === id);
                if (isUserInBooking) {
                    alert("Cannot delete user because they are associated with a booking.");
                    return;
                }

                const response = await fetchWithToken(`${SERVER_API}/users/${id}`, { method: "DELETE" });
                if (response.ok) {
                    alert("User deleted successfully.");
                    fetchUsers();
                } else {
                    alert("Failed to delete user.");
                }
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("An error occurred while deleting the user.");
            }
        }
    };

    const exportToExcel = () => {

        setUsers(users.sort((a, b) => a.id - b.id))
        const filteredData = users.map(({ password, ...rest }) => rest);
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
        XLSX.writeFile(workbook, "User_List.xlsx");
    };

    const filteredUsers = users.filter((user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(user.phoneNumber).includes(searchTerm)
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    if (loading) {
        return <div>Loading data...</div>;
    }

    return (
        <div className="container">
            <Header title={'Users'} />
            <div className="user-list-container content">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search users by email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="toolbar">
                    <button onClick={() => openForm("add")} className="add-button">Add User</button>
                    <button onClick={exportToExcel} className="export-users-button">Export to Excel</button>
                </div>

                {showForm && (
                    <UserForm
                        formType={formType}
                        formData={formData}
                        onChange={handleFormChange}
                        onSubmit={handleSubmit}
                        onCancel={closeForm}
                        errorMessage={errorMessage}
                    />
                )}

                <UserTable
                    currentUsers={currentUsers}
                    onEdit={(user) => openForm("edit", user)}
                    onDelete={handleDelete}
                />

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}

export default Users;
