import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./BookingItem.scss";

const BookingItem = ({ booking }) => {
    const { flights, formatDate, formatTime, formatPrice } = useContext(StoreContext);
    const [showDetails, setShowDetails] = useState(false);

    // Lấy ticket đầu tiên (giả định mỗi booking có ít nhất 1 ticket)
    const ticket = booking.tickets[0];

    // Từ ticket.seatClassAirplaneFlightId tìm flight:
    const scafId = ticket.seatClassAirplaneFlightId;
    // flights từ context chứa seatOptions với id bằng scafId
    const seatOption = flights
        .flatMap(f => f.seatOptions)
        .find(opt => opt.id === scafId);

    const flight = seatOption
        ? flights.find(f => f.id === seatOption.flightId)
        : null;

    return (
        <div className="orderlist-item">
            <div>
                <strong>Booking #:</strong> {booking.id}
            </div>
            <div>
                <strong>Date:</strong> {formatDate(booking.bookingDate)} {formatTime(booking.bookingDate)}
            </div>
            <div>
                <strong>Status:</strong> {booking.status}
            </div>
            <div>
                <strong>Total:</strong> {formatPrice(booking?.totalPrice || 0)} VND
            </div>
            {flight && (
                <div>
                    <strong>Flight:</strong> {flight.originAirport.iataCode} → {flight.destinationAirport.iataCode} (
                    {flight.flightNumber})
                </div>
            )}
            <div>
                <button onClick={() => setShowDetails(!showDetails)}>
                    {showDetails ? "Hide Details" : "Details"}
                </button>
            </div>

            {showDetails && (
                <div className="order-details">
                    {/* 1. Thông tin hành khách */}
                    <h4>Passengers</h4>
                    {booking.tickets.map((t, idx) => (
                        <div key={t.id} className="passenger">
                            <p>
                                {idx + 1}. {t.passenger.firstName} {t.passenger.lastName} — DOB:{" "}
                                {t.passenger.dateOfBirth}
                            </p>
                            <p>Passport: {t.passenger.passportNumber}</p>
                        </div>
                    ))}

                    {/* 2. Thông tin chuyến bay */}
                    {flight && (
                        <>
                            <h4>Flight Info</h4>
                            <p>
                                {flight.originAirport.name} ({flight.originAirport.iataCode}) →{" "}
                                {flight.destinationAirport.name} ({flight.destinationAirport.iataCode})
                            </p>
                            <p>
                                {formatDate(flight.departureTime)} {formatTime(flight.departureTime)} —{" "}
                                {formatTime(flight.arrivalTime)}
                            </p>
                            <p>Class: {seatOption.seatClassName} — Price: {formatPrice(seatOption?.seatPrice || 0)} VND</p>
                            <p>Seat #: {ticket.seatNumber || "—"}</p>
                        </>
                    )}

                    {/* 3. Thông tin thanh toán */}
                    {booking.payment && (
                        <>
                            <h4>Payment</h4>
                            <p>Method: {booking.payment.paymentMethod}</p>
                            <p>
                                Date: {formatDate(booking.payment.paymentDate)}{" "}
                                {formatTime(booking.payment.paymentDate)}
                            </p>
                            <p>Amount: {formatPrice(booking?.payment?.amount || 0)} VND</p>
                            <p>Status: {booking.payment.status}</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default BookingItem;
