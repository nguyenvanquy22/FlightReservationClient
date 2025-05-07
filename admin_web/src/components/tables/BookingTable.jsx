// BookingTable.jsx
import React from 'react';
import './styles/BookingTable.scss';

const BookingTable = ({ bookings }) => {
    const formatDate = dt =>
        new Date(dt).toLocaleString();

    return (
        <table className="booking-table">
            <thead>
                <tr>
                    <th>Booking ID</th>
                    <th>Booking Date</th>
                    <th>User Email</th>
                    <th>Status</th>
                    <th># Tickets</th>
                    <th>Total Price</th>
                    <th>Tickets Detail</th>
                </tr>
            </thead>
            <tbody>
                {bookings.map(booking => {
                    // Tính tổng giá: tổng price của tickets + bất cứ phí luggage nào nếu có
                    const totalPrice = booking.tickets
                        .reduce((sum, t) => sum + parseFloat(t.price || 0), 0)
                        .toFixed(2);

                    return (
                        <tr key={booking.id}>
                            <td>{booking.id}</td>
                            <td>{formatDate(booking.bookingDate)}</td>
                            <td>{booking.user.email}</td>
                            <td>{booking.status}</td>
                            <td>{booking.tickets.length}</td>
                            <td>{totalPrice}</td>
                            <td>
                                <table className="nested-table">
                                    <thead>
                                        <tr>
                                            <th>Seat</th>
                                            <th>Class</th>
                                            <th>Passenger</th>
                                            <th>Ticket Price</th>
                                            <th>Luggage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {booking.tickets.map(ticket => (
                                            <tr key={ticket.id}>
                                                <td>{ticket.seatNumber}</td>
                                                <td>
                                                    {ticket.seatClassAirplaneFlight?.seatClass?.name || '—'}
                                                </td>
                                                <td>
                                                    {ticket.passenger.firstName}{' '}
                                                    {ticket.passenger.lastName}
                                                </td>
                                                <td>{parseFloat(ticket.price).toFixed(2)}</td>
                                                <td>
                                                    {ticket.luggages && ticket.luggages.length > 0
                                                        ? ticket.luggages.map(l => (
                                                            <div key={l.luggageId}>
                                                                {l.luggageType} ({l.weightLimit}kg): {l.price}
                                                            </div>
                                                        ))
                                                        : '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default BookingTable;
