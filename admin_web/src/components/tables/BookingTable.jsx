// BookingTable.jsx
import React from 'react';
import './styles/BookingTable.scss';

const BookingTable = ({ bookings }) => {
    const formatDate = dt => new Date(dt).toLocaleString();

    return (
        <table className="booking-table">
            <thead>
                {/* Row 1: Main headings, với Tickets Detail colspan=6 */}
                <tr>
                    <th rowSpan="2">Booking ID</th>
                    <th rowSpan="2">Booking Date</th>
                    <th rowSpan="2">User</th>
                    <th rowSpan="2">Status</th>
                    <th rowSpan="2">Tickets</th>
                    <th rowSpan="2">Total Price</th>
                    <th colSpan="6">Tickets Detail</th>
                </tr>
                {/* Row 2: Sub-headings for Tickets Detail */}
                <tr>
                    <th>Flight</th>
                    <th>Seat</th>
                    <th>Class</th>
                    <th>Passenger</th>
                    <th>Ticket Price</th>
                    {/* <th>Luggage</th> */}
                </tr>
            </thead>
            <tbody>
                {/* Nếu muốn mỗi ticket nằm trên dòng riêng, bạn có thể render như sau: */}
                {bookings.flatMap(booking => {
                    return booking.tickets.map((ticket, idx) => (
                        <tr key={`${booking.id}-${ticket.id}`} className="ticket-row">
                            {/* Chỉ in các thông tin chung ở dòng đầu */}
                            {idx === 0 ? (
                                <>
                                    <td rowSpan={booking.tickets.length}>{booking.id}</td>
                                    <td rowSpan={booking.tickets.length}>{formatDate(booking.bookingDate)}</td>
                                    <td rowSpan={booking.tickets.length}>{booking.user.username}</td>
                                    <td rowSpan={booking.tickets.length}>{booking.status}</td>
                                    <td rowSpan={booking.tickets.length}>{booking.tickets.length}</td>
                                    <td rowSpan={booking.tickets.length}>{booking.totalPrice?.toLocaleString('vi-VN')} VND</td>
                                </>
                            ) : null}

                            {/* Các cột chi tiết vé */}
                            <td>{ticket.flightNumber || '—'}</td>
                            <td>{ticket.seatNumber || '—'}</td>
                            <td>{ticket.seatClassName || '—'}</td>
                            <td>{ticket.passenger.firstName} {ticket.passenger.lastName}</td>
                            <td>{parseFloat(ticket.price).toLocaleString('vi-VN')} VND</td>
                            {/* <td>
                                {ticket.luggages && ticket.luggages.length > 0
                                    ? ticket.luggages.map(l => (
                                        <div key={l.luggageId}>
                                            {l.luggageType} ({l.weightLimit}kg): {l.price.toLocaleString('vi-VN')}
                                        </div>
                                    ))
                                    : '—'}
                            </td> */}
                        </tr>
                    ));
                })}
            </tbody>
        </table>
    );
};

export default BookingTable;
