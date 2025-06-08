import React, { useContext } from "react";
import './MyOrder.scss';
import { Link, Route, Routes } from "react-router-dom";
import Profile from "../../components/Myorder/Profile/Profile";
import Myorderlist from "../../components/Myorder/MyorderList/Myorderlist";
import ChangePassword from "../../components/Myorder/ChangePassword/ChangePassword";
import Setting from "../../components/Myorder/Setting/Setting";
import ContactList from "../../components/Myorder/ContactList/ContactList";
import { StoreContext } from "../../context/StoreContext";

const MyOrder = () => {
    const { setToken, setUser } = useContext(StoreContext);
    return (
        <div className="myorder">
            <div className="sidebar">
                <Link to=''><div className="my_orders">My orders</div></Link>
                <Link to='profile'><div className="profile">Profile</div></Link>
                <Link to='change-password'><div className="change_password">Change password</div></Link>
                {/* <Link to='contact-list'><div className="contact_list">Contact list</div></Link> */}
                <Link to='setting'><div className="setting">Setting</div></Link>
                <div className="signout" onClick={() => {
                    setToken(false)
                    localStorage.removeItem('userId')
                    setUser({})
                }}>Sign out</div>
            </div>
            <div className="content">
                <Routes>
                    <Route path="/" element={<Myorderlist />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="change-password" element={<ChangePassword />} />
                    <Route path="contact-list" element={<ContactList />} />
                    <Route path="setting" element={<Setting />} />
                </Routes>
            </div>
        </div>
    );
}

export default MyOrder;