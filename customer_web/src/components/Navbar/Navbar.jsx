import React, { useState, useContext, useEffect } from "react";
import './Navbar.scss';
import { assets } from "../../assets/assets";
import { Link, useLocation } from 'react-router-dom';
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin }) => {

    const { setToken, token, user, setUser, fetchUser } = useContext(StoreContext);
    const [menu, setMenu] = useState("home");
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setMenu(location.pathname.split('/')[1] || "home");
        const handleScroll = () => {
            if (location.pathname === '/my-orders') {
                setScrolled(true);
            } else if (location.pathname.startsWith('/my-orders')) {
                setScrolled(true);
            }
            else if (location.pathname === '/booking') {
                setScrolled(true);
            }
            else if (location.pathname === '/confirm') {
                setScrolled(true);
            }
            else if (location.pathname === '/booking-success' || location.pathname === '/booking-fail') {
                setScrolled(true);
            }
            else if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        handleScroll();

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [location.pathname]);

    let tontai = false;

    if (localStorage.getItem('userId')) {
        tontai = true;
    }

    return (
        <nav>
            <div className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                {/* <div> */}
                <ul className='navbar-menu'>
                    <Link to="/">
                        {/* <img src={assets.airpaz2} className={`airpaz ${scrolled ? 'scrolled' : ''}`} alt="logo" /> */}
                        <div onClick={() => setMenu("home")} className="logo">UTC-FR</div>
                    </Link>
                    <Link to="/">
                        <li onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</li>
                    </Link>
                    <Link to="/flight">
                        <li onClick={() => setMenu("flight")} className={menu === "flight" ? "active" : ""}>Flight</li>
                    </Link>
                    <Link to="/my-orders">
                        <li onClick={() => setMenu("my-orders")} className={menu === "my-orders" ? "active" : ""}>Order</li>
                    </Link>
                </ul>
                {/* </div> */}
                <ul className='navbar-profile'>
                    <li className="flag"><img src={assets.englandflag} className="flag" alt="language"></img></li>
                    <li>Help</li>
                    {!tontai ?
                        <li onClick={() => setShowLogin(true)}>Sign-In</li>
                        :
                        <h4>{user.username}</h4>
                    }
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;