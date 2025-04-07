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
        const handleScroll = () => {
            if (location.pathname === '/myorder') {
                setScrolled(true);
            } else if (location.pathname.startsWith('/myorder')) {
                setScrolled(true);
            }
            else if (location.pathname === '/booking') {
                setScrolled(true);
            }
            else if (location.pathname === '/confirm') {
                setScrolled(true);
            }
            else if (location.pathname === '/booking/success') {
                setScrolled(true);
            }
            else if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        handleScroll();
        // console.log("userId", localStorage.getItem('userId'))
        // localStorage.removeItem('userId')
        // localStorage.removeItem('customerToken')

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [location.pathname]);

    // fetchUser()

    let tontai = false;
    // if(token) {
    //     tontai = true;
    // }
    if (localStorage.getItem('userId')) {
        tontai = true;
    }

    return (
        <nav>
            <div className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                {/* <div> */}
                <ul className='navbar-menu'>
                    <Link to="/">
                        <img src={assets.airpaz2} className={`airpaz ${scrolled ? 'scrolled' : ''}`} alt="logo" />
                    </Link>
                    <Link to="/">
                        <li onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</li>
                    </Link>
                    <Link to="/flight">
                        <li onClick={() => setMenu("flight")} className={menu === "flight" ? "active" : ""}>Flight</li>
                    </Link>
                    <Link to="/myorder">
                        <li onClick={() => setMenu("order")} className={menu === "order" ? "active" : ""}>Order</li>
                    </Link>
                    <Link to="/contact"><li onClick={() => setMenu("contact")} className={menu === "contact" ? "active" : ""}>
                        Contact us</li></Link>
                </ul>
                {/* </div> */}
                <ul className='navbar-profile'>
                    <li className="flag"><img src={assets.englandflag} className="flag" alt="language"></img></li>
                    <li>Help</li>
                    <li>App-Download</li>
                    {!tontai ?
                        <li onClick={() => setShowLogin(true)}>Sign-In</li>
                        :
                        <h4>{user.username}</h4>
                    }
                    {/* <li onClick={() => setShowLogin(true)}><h4>john_doe</h4></li> */}

                </ul>
            </div>
        </nav>
    );
};

export default Navbar;