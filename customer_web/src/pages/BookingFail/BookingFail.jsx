import React from "react";
import { useNavigate } from "react-router-dom";
import "./BookingFail.scss";

const BookingFail = () => {
    const navigate = useNavigate();

    return (
        <div className="booking-fail">
            <div className="fail-container">
                <h2>Booking Failed</h2>
                <p>
                    We’re sorry, but we were unable to complete your booking.
                    Please try again or contact customer support if the problem persists.
                </p>

                <div className="buttons">
                    <button onClick={() => navigate(-1)}>Try Again</button>
                    <button onClick={() => navigate("/")}>Go to Home</button>
                </div>
            </div>
        </div>
    );
};

export default BookingFail;
