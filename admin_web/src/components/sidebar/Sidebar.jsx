import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.scss';

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const handleLogout = (e) => {
        e.preventDefault();

        const confirmLogout = window.confirm("Do you want to log out?");

        if (confirmLogout) {
            localStorage.removeItem("adminToken");
            navigate("/login");
        }
    };

    const isActive = (path) => currentPath === path;

    return (
        <div className="sidebar">
            <div>
                <h3>Flights Management</h3>
            </div>
            <div>
                <Link to="/dashboard" className={isActive("/dashboard") || isActive("/") ? "active" : ""}>Dashboard</Link>
                <Link to="/flights" className={isActive("/flights") ? "active" : ""}>Flights</Link>
                <Link to="/airplanes" className={isActive("/airplanes") ? "active" : ""}>Airplanes</Link>
                <Link to="/airlines" className={isActive("/airlines") ? "active" : ""}>Airlines</Link>
                <Link to="/airports" className={isActive("/airports") ? "active" : ""}>Airports</Link>
                <Link to="/bookings" className={isActive("/bookings") ? "active" : ""}>Bookings</Link>
                <Link to="/users" className={isActive("/users") ? "active" : ""}>Users</Link>
                <Link to="/login" onClick={handleLogout} className='logout'>Log out</Link>
            </div>
        </div>
    );
}

export default Sidebar;
