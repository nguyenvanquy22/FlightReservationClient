import React, { useState, useContext } from "react";
import axios from "axios";
import "./Profile.scss";
import { StoreContext } from "../../../context/StoreContext";

// const Profile = () => {
//     const { user, setUser } = useContext(StoreContext);
//     const [isEditingProfile, setIsEditingProfile] = useState(false);
//     const [formData, setFormData] = useState({
//         id: user.id,
//         email: user.email || "",
//         phoneNumber: user.phoneNumber || "",
//         firstName: user.firstName || "",
//         lastName: user.lastName || "",
//         username: user.username || "",
//         password: user.password || "",
//         role: user.role || "",
//     });

//     const handleEditOrSave = async (e) => {
//         e.preventDefault();

//         if (isEditingProfile) {
//             const isConfirmed = window.confirm("Are you sure about that?");
//             if (!isConfirmed) return;

//             try {
//                 const response = await axios.put(
//                     `http://localhost:8080/api/users/${localStorage.getItem("userId")}`,
//                     { ...formData },
//                     {
//                         headers: {
//                             Authorization: `Bearer ${localStorage.getItem("customerToken")}`,
//                         },
//                     }
//                 );
//                 setUser(response.data);
//             } catch (error) {
//                 console.error("Error updating profile:", error);
//                 alert("Failed to update profile. Please try again!");
//             }
//         }
//         setIsEditingProfile(!isEditingProfile);
//     };



//     return (
//         <div className="profile-container">
//             <h1>{user.username || "User Profile"}</h1>
//             <div className="profile-card">
//                 <div className="profile-header">
//                     <div className="profile-picture">
//                         <span>{user.username?.charAt(0)}</span>
//                     </div>
//                     <button
//                         className="edit-btn"
//                         onClick={handleEditOrSave}
//                     >
//                         {isEditingProfile ? "Save Profile" : "Edit Profile"}
//                     </button>

//                 </div>

//                 <form className="profile-form" onSubmit={handleEditOrSave}>
//                     <div className="profile-row">
//                         <label>Email</label>
//                         {isEditingProfile ? (
//                             <input
//                                 type="email"
//                                 value={formData.email}
//                                 onChange={(e) =>
//                                     setFormData({ ...formData, email: e.target.value })
//                                 }
//                                 required
//                             />
//                         ) : (
//                             <span>{user.email}</span>
//                         )}
//                     </div>
//                     <div className="profile-row">
//                         <label>Mobile Number</label>
//                         {isEditingProfile ? (
//                             <input
//                                 type="text"
//                                 value={formData.phoneNumber}
//                                 onChange={(e) =>
//                                     setFormData({ ...formData, phoneNumber: e.target.value })
//                                 }
//                                 required
//                             />
//                         ) : (
//                             <span>{user.phoneNumber || "Not available"}</span>
//                         )}
//                     </div>
//                     <div className="profile-row">
//                         <label>First Name</label>
//                         {isEditingProfile ? (
//                             <input
//                                 type="text"
//                                 value={formData.firstName}
//                                 onChange={(e) =>
//                                     setFormData({ ...formData, firstName: e.target.value })
//                                 }
//                                 required
//                             />
//                         ) : (
//                             <span>{user.firstName}</span>
//                         )}
//                     </div>
//                     <div className="profile-row">
//                         <label>Last Name</label>
//                         {isEditingProfile ? (
//                             <input
//                                 type="text"
//                                 value={formData.lastName}
//                                 onChange={(e) =>
//                                     setFormData({ ...formData, lastName: e.target.value })
//                                 }
//                                 required
//                             />
//                         ) : (
//                             <span>{user.lastName}</span>
//                         )}
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Profile;

const Profile = () => {
    const { user, setUser } = useContext(StoreContext);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [formData, setFormData] = useState({
        id: user.id,
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        password: user.password || "",
        role: user.role || "",
    });

    const handleEditOrSave = async (e) => {
        e.preventDefault();
    
        // Kiểm tra tính hợp lệ của các trường trong form
        const form = e.target.closest("form"); // Lấy phần tử form chứa nút submit
        const emailValid = form.email.checkValidity();
        const phoneValid = /^[0-9]+$/.test(form.phoneNumber.value); // Regex kiểm tra số điện thoại chỉ chứa số
    
        // Kiểm tra tính hợp lệ của form
        if (!form.checkValidity()) {
            let errorMessage = "";
            if (!emailValid) {
                errorMessage += "Email không đúng định dạng.\n";
            }
            if (!phoneValid) {
                errorMessage += "Số điện thoại chỉ được nhập số.\n";
            }
            if (errorMessage) {
                alert(errorMessage);
                return; // Nếu có lỗi, dừng lại
            }
        }
    
        // Xác nhận trước khi lưu
        if (isEditingProfile) {
            const isConfirmed = window.confirm("Are you sure about that?");
            if (!isConfirmed) return;
    
            try {
                const response = await axios.put(
                    `http://localhost:8080/api/users/${localStorage.getItem("userId")}`,
                    { ...formData },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("customerToken")}`,
                        },
                    }
                );
                setUser(response.data); // Cập nhật thông tin người dùng
            } catch (error) {
                console.error("Error updating profile:", error);
                alert("Failed to update profile. Please try again!");
            }
        }
        setIsEditingProfile(!isEditingProfile); // Chuyển đổi chế độ chỉnh sửa
    };
    

    return (
        <div className="profile-container">
            <h1>{user.username || "User Profile"}</h1>
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-picture">
                        <span>{user.username?.charAt(0).toUpperCase()}</span>
                    </div>
                    <button
                        className="edit-btn"
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                    >
                        {isEditingProfile ? "Cancel Edit" : "Edit Profile"}
                    </button>
                </div>

                <form className="profile-form" onSubmit={handleEditOrSave}>
                    <div className="profile-row">
                        <label>Email</label>
                        {isEditingProfile ? (
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                required
                            />
                        ) : (
                            <span>{user.email}</span>
                        )}
                    </div>
                    <div className="profile-row">
                        <label>Mobile Number</label>
                        {isEditingProfile ? (
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={(e) =>
                                    setFormData({ ...formData, phoneNumber: e.target.value })
                                }
                                required
                            />
                        ) : (
                            <span>{user.phoneNumber || "Not available"}</span>
                        )}
                    </div>
                    <div className="profile-row">
                        <label>First Name</label>
                        {isEditingProfile ? (
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={(e) =>
                                    setFormData({ ...formData, firstName: e.target.value })
                                }
                                required
                            />
                        ) : (
                            <span>{user.firstName}</span>
                        )}
                    </div>
                    <div className="profile-row">
                        <label>Last Name</label>
                        {isEditingProfile ? (
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={(e) =>
                                    setFormData({ ...formData, lastName: e.target.value })
                                }
                                required
                            />
                        ) : (
                            <span>{user.lastName}</span>
                        )}
                    </div>
                    {isEditingProfile && (
                        <div className="save-btn">
                            <button type="submit">{isEditingProfile ? "Save Profile" : "Edit Profile"}</button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Profile;
