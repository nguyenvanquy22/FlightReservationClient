import React, { useEffect, useContext, useState } from 'react';
import "./TicketBooking.scss";
import { StoreContext } from "../../context/StoreContext";

const TicketBooking = ({ myTicket }) => {
    const { formatTime, formatDate, formatPrice, flights } = useContext(StoreContext);
    const [popup, setPopup] = useState(false);

    useEffect(() => {
        console.log("flights", flights);
        console.log("myTicket", myTicket);
    }, [myTicket, flights]);

    // Kiểm tra dữ liệu trước khi tìm selectedFlight
    const selectedFlight = flights ? flights.find(flight => flight.flightId === myTicket.flightId) : null;



    // console.log("ABC" , myTicket.user.id);
    if (!localStorage.getItem("userId")) {
        return ;
    }
    // Kiểm tra xem selectedFlight có tồn tại không
    if (!myTicket || !selectedFlight) {
        return ; // Hoặc thông báo phù hợp
    }


    return (
        <div className="ticket-booking">
            <div className="title">
                <p>Flight</p>
                <p className="separate">|</p>
                <p>Airpaz Code: 1027425027</p>
                <p className="separate">|</p>
                <p>Booked date: {formatDate(myTicket.bookingDate)}</p>
            </div>
            <hr />
            <div className="main">
                <div className="title1">{selectedFlight.departureAirport.city} {`->`} {selectedFlight.arrivalAirport.city}</div>
                <div className="container">
                    <div className="place">
                        <p>Departure</p>
                        <div className='time'>
                            <p>{formatDate(selectedFlight.departureTime)}</p>
                            <p>|</p>
                            <p>{formatTime(selectedFlight.departureTime)}</p>
                        </div>
                    </div>
                    <div className="info">
                        <p>Total</p>
                        <p>đ {formatPrice(myTicket.totalPrice)}</p>
                    </div>
                    {/* <button className='detai' onClick={() => { setPopup(!popup) }}>Details</button> */}
                    <button className='detai' onClick={() => { setPopup(!popup) }}>Details</button>
                </div>
            </div>
            <div className={`popup ${popup ? 'active' : ''}`}>
                {/* <h1>ABC</h1> */}
                {/* {selectedFlight.map((flight) => */}
                <div key={selectedFlight.flightId} className="contain">
                    {/* {selectedFlight.flightId} */}
                    <div className="depart">
                        <h2>
                            {selectedFlight.departureAirport.city} ({selectedFlight.departureAirport.country}) - {selectedFlight.arrivalAirport.city} ({selectedFlight.arrivalAirport.country})
                        </h2>
                        <p>
                            {formatTime(selectedFlight.departureTime)} - {formatDate(selectedFlight.departureTime)} |
                            {formatTime(selectedFlight.arrivalTime)} - {formatDate(selectedFlight.arrivalTime)} |
                            {selectedFlight.transitPointList && selectedFlight.transitPointList.length > 0 ? '1 transitpoint' : 'Direct'}
                        </p>
                    </div>

                    <div className="passenger-details">
                        {myTicket.passengers.map((passenger, index) => (
                            <div key={passenger.passengerId} className="form-info">
                                <h3>Passenger {index + 1}</h3>

                                <div className="input-info">
                                    <div>
                                        <label>First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={passenger.firstName}
                                            readOnly // Chỉ đọc, nếu không cần chỉnh sửa
                                        />
                                    </div>
                                    <div>
                                        <label>Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={passenger.lastName}
                                            readOnly // Chỉ đọc
                                        />
                                    </div>
                                </div>

                                <div className="input-info">
                                    <div>
                                        <label>Passport Number</label>
                                        <input
                                            type="text"
                                            name="passportNumber"
                                            value={passenger.passportNumber}
                                            readOnly // Chỉ đọc
                                        />
                                    </div>
                                    <div>
                                        <label>Date of Birth</label>
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={passenger.dateOfBirth}
                                            readOnly // Chỉ đọc
                                        />
                                    </div>
                                </div>

                                {/* {myTicket.luggage.map((luggage) => (
                                    <div key={luggage.luggageId} className="input-info-seat-class">
                                        <p>Luggage: {luggage.weight}kg - Price: {formatPrice(luggage.price)} VND</p>
                                    </div>
                                ))} */}

                                {/* {myTicket.bookingTicketType.map((ticketType) => (
                                    <div key={ticketType.bookingTicketTypeId} className="input-info-seat-class">
                                        <p>Class: {ticketType.ticketType.name} - Quantity: {ticketType.quantity}</p>
                                    </div>
                                ))} */}
                            </div>
                        ))}
                <button onClick={() => { setPopup(!popup) }}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TicketBooking;
