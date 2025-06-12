// BookingItem.jsx
import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./BookingItem.scss";

const BookingItem = ({ booking }) => {
    const { flights, formatDate, formatTime, formatPrice } = useContext(StoreContext);
    const [showDetails, setShowDetails] = useState(false);

    // Với mỗi ticket trong booking.tickets, tìm flight và seatOption tương ứng
    const ticketsWithFlight = booking.tickets.map(ticket => {
        const seatOption = flights
            .flatMap(f => f.seatOptions.map(opt => ({ ...opt, flightId: f.id })))
            .find(opt => opt.id === ticket.seatClassAirplaneFlightId);

        const flight = seatOption
            ? flights.find(f => f.id === seatOption.flightId)
            : null;

        return { ticket, seatOption, flight };
    });

    return (
        <div className="orderlist-item">
            <div><strong>Booking #:</strong> {booking.id}</div>
            <div><strong>Date:</strong> {formatDate(booking.bookingDate)} {formatTime(booking.bookingDate)}</div>
            <div><strong>Status:</strong> {booking.status}</div>
            <div><strong>Total:</strong> {formatPrice(booking.totalPrice)} VND</div>
            <div>
                <button onClick={() => setShowDetails(d => !d)}>
                    {showDetails ? "Hide Details" : "Details"}
                </button>
            </div>

            {showDetails && (
                <div className="order-details">
                    {ticketsWithFlight.map(({ ticket, seatOption, flight }, idx) => (
                        <div key={ticket.id} className="ticket-detail">
                            <h4>Ticket #{idx + 1}</h4>

                            {flight && (
                                <div className="flight-info">
                                    <p>
                                        <strong>Flight:</strong> {flight.originAirport.iataCode} → {flight.destinationAirport.iataCode} ({flight.flightNumber})
                                    </p>
                                    <p>
                                        <strong>Time:</strong> {formatDate(flight.departureTime)} {formatTime(flight.departureTime)}
                                        {"  →  "}
                                        {formatDate(flight.arrivalTime)} {formatTime(flight.arrivalTime)}
                                    </p>
                                </div>
                            )}

                            <div className="passenger-info">
                                <p>
                                    <strong>Passenger:</strong> {ticket.passenger.firstName} {ticket.passenger.lastName}
                                </p>
                                {ticket.passenger.dateOfBirth && (
                                    <p><strong>DOB:</strong> {ticket.passenger.dateOfBirth}</p>
                                )}
                                <p><strong>Passport:</strong> {ticket.passenger.passportNumber}</p>
                                {ticket.passenger.phoneNumber && (
                                    <p><strong>Phone:</strong> {ticket.passenger.phoneNumber}</p>
                                )}
                            </div>

                            <div className="seat-info">
                                <p><strong>Class:</strong> {seatOption?.seatClassName || "—"}</p>
                                <p><strong>Seat #:</strong> {ticket.seatNumber || "—"}</p>
                                <p>
                                    <strong>Price:</strong> {formatPrice(ticket.price)} VND
                                </p>
                            </div>

                            {ticket.luggages && ticket.luggages.length > 0 && (
                                <div className="luggage-info">
                                    <strong>Luggage:</strong>
                                    {ticket.luggages.map(lug => (
                                        <p key={lug.luggageId}>
                                            {lug.type} — {lug.weightLimit}kg: {formatPrice(lug.price)} VND
                                        </p>
                                    ))}
                                </div>
                            )}

                            <hr />
                        </div>
                    ))}

                    {booking.payment && (
                        <div className="payment-info">
                            <h4>Payment</h4>
                            <p><strong>Method:</strong> {booking.payment.paymentMethod}</p>
                            <p>
                                <strong>Date:</strong> {formatDate(booking.payment.paymentDate)}{" "}
                                {formatTime(booking.payment.paymentDate)}
                            </p>
                            <p><strong>Amount:</strong> {formatPrice(booking.payment.amount)} VND</p>
                            <p><strong>Status:</strong> {booking.payment.status}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BookingItem;
