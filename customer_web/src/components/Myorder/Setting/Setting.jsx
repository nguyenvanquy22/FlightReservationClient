import React from "react";
import './Setting.scss'

const Setting = () => {
    return (
        <div class="main-content-account-linking">
            <h2>Account Linking</h2>
            <div class="account-linking-info">
                <p>Link your account to easily access your bookings and profiles across platforms:</p>
                <ul>
                    <li><strong>Google:</strong> <button class="link-btn">Link</button></li>
                    <li><strong>Facebook:</strong> <button class="link-btn">Link</button></li>
                    <li><strong>Apple ID:</strong> <button class="link-btn">Link</button></li>
                    <li><strong>Twitter:</strong> <button class="link-btn">Link</button></li>
                </ul>
            </div>
        </div>
    )
}

export default Setting;