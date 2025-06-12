import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./BookingSuccess.scss";
import config from '../../config'
const { SERVER_API } = config;

const BookingSuccess = () => {
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const bookingId = query.get('bookingId');
    const navigate = useNavigate();
    const { token, formatDate, formatTime, formatPrice, flights } = useContext(StoreContext);

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await axios.get(
                    `${SERVER_API}/bookings/${bookingId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setBooking(res.data.data);
            } catch (e) {
                console.error(e);
                setError("Không tìm thấy thông tin booking.");
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId, token]);

    if (loading) return <div className="booking-success">Loading...</div>;
    if (error) return <div className="booking-success error">{error}</div>;
    if (!booking) return null;

    return (
        <div className="booking-success">
            <div className="header">
                <h2>Booking #{booking.id} Success!</h2>
                <p>
                    Date: {formatDate(booking.bookingDate)}{" "}
                    {formatTime(booking.bookingDate)}
                </p>
                <p>Status: <span className="status">{booking.status}</span></p>
                <p>Total price: <strong>{formatPrice(booking.totalPrice)} VND</strong></p>
            </div>

            <div className="payment-info">
                <h3>Payment infomation</h3>
                {booking.payment ? (
                    <ul>
                        <li>Method: {booking.payment.paymentMethod}</li>
                        <li>
                            Payment date:{" "}
                            {formatDate(booking.payment.paymentDate)}{" "}
                            {formatTime(booking.payment.paymentDate)}
                        </li>
                        <li>Amount: {formatPrice(booking.payment.amount)} VND</li>
                        <li>Status: {booking.payment.status}</li>
                    </ul>
                ) : (
                    <p>No payment information yet</p>
                )}
            </div>

            <div className="tickets">
                <h3>Ticket infomation ({booking.tickets.length})</h3>
                {booking.tickets.map((t, idx) => (
                    <div key={t.id} className="ticket-item">
                        <h4>Ticket #{idx + 1}</h4>
                        <p>
                            <strong>Passenger:</strong>{" "}
                            {t.passenger.firstName} {t.passenger.lastName} — DOB:{" "}
                            {t.passenger.dateOfBirth}
                        </p>
                        <p>
                            <strong>Flight:</strong>{" "}
                            {t.seatClassAirplaneFlightId}
                        </p>
                        {/* nếu bạn có flight info in DTO, thay bằng flightNumber etc */}
                        <p>
                            <strong>Seat Class:</strong>{" "}
                            {flights.flatMap(f => f.seatOptions)
                                .find(opt => opt.id === t.seatClassAirplaneFlightId)?.seatClassName || "-"}
                        </p>
                        <p>
                            <strong>Seat #:</strong> {t.seatNumber || "-"}
                        </p>
                        <p>
                            <strong>Ticket price:</strong> {formatPrice(t.price)} VND
                        </p>
                    </div>
                ))}
            </div>

            <div className="actions">
                <button onClick={() => navigate("/")}>Back to home page</button>
                <button onClick={() => navigate("/myorder")}>View my orders</button>
            </div>
        </div>
    );
};

export default BookingSuccess;
