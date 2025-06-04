import React, { useContext, useState, useEffect } from "react";
import "./Confirm.scss";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const Confirm = () => {
    const navigate = useNavigate();
    const {
        selectedDepartureFlight,
        selectedSeatOption,
        isRoundTrip,
        selectedReturnFlight,
        returnSeatOption,
        updatePassengerCount,
        calculateTotalPrice,
        formatPrice,
        formatTime,
        formatDate,
        calculateDuration,
    } = useContext(StoreContext);

    const [adults, setAdults] = useState(1);

    useEffect(() => {
        updatePassengerCount(adults);
    }, [adults]);

    if (!selectedDepartureFlight || !selectedSeatOption) {
        return <p>Please select a flight and seat class first.</p>;
    }

    const total = calculateTotalPrice();

    // Build array of flights and seatOptions
    const flights = isRoundTrip
        ? [selectedDepartureFlight, selectedReturnFlight]
        : [selectedDepartureFlight];
    const seatOptions = isRoundTrip
        ? [selectedSeatOption, returnSeatOption]
        : [selectedSeatOption];

    return (
        <div className="confirm-page">
            <h3>Trip Summary</h3>
            <div className="contain">
                <div className="left">
                    {flights.map((flight, idx) => (
                        <div key={idx} className="flight-info">
                            {/* Route */}
                            <div className="main-content">
                                <p>{flight.originAirport.city}</p>
                                <div>
                                    <p>{'--'}</p>
                                    <p>{'>'}</p>
                                </div>
                                <p>{flight.destinationAirport.city}</p>
                                <span className="basePrice">
                                    {formatPrice(seatOptions[idx]?.seatPrice || 0)} VND
                                </span>
                            </div>
                            {/* Transit details */}
                            <div className="transit-points">
                                <div className="aircraft">
                                    <img
                                        src={assets.aircraftIcon1}
                                        className="svg"
                                        alt="plane"
                                    />
                                    <p>{flight.airplane.airline.name}</p>
                                </div>
                                <div className="left-transit-points">
                                    <div className="time">
                                        <p>{formatTime(flight.departureTime)}</p>
                                        <p>{formatDate(flight.departureTime)}</p>
                                    </div>
                                    <div className="arrow">
                                        o<hr />v
                                    </div>
                                    <div className="time">
                                        <p>{formatTime(flight.arrivalTime)}</p>
                                        <p>{formatDate(flight.arrivalTime)}</p>
                                    </div>
                                </div>
                                <div className="right-transit-points">
                                    <div className="place">
                                        <div>
                                            <p>{flight.originAirport.name}</p>
                                            <p>
                                                {flight.originAirport.city} - {flight.originAirport.country}
                                            </p>
                                        </div>
                                        <div className="time-place">
                                            <img src={assets.clock} alt="clock" />
                                            <p>
                                                {calculateDuration(
                                                    flight.departureTime,
                                                    flight.arrivalTime
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p>{flight.destinationAirport.name}</p>
                                            <p>
                                                {flight.destinationAirport.city} - {flight.destinationAirport.country}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Right panel */}
                <div className="right">
                    <h2>Price Detail</h2>
                    <p>(Default is {selectedSeatOption.seatClassName})</p>
                    <hr />

                    <div className="adult-count">
                        <p>Adults</p>
                        <div>
                            <button onClick={() => setAdults(a => Math.max(1, a - 1))}>-</button>
                            <p>{adults}</p>
                            <button onClick={() => setAdults(a => Math.min(10, a + 1))}>+</button>
                        </div>
                    </div>

                    <hr />

                    <div className="total-price">
                        <div>
                            <p>Total Price</p>
                            {isRoundTrip ? <p>20% off</p> : <p>(For {adults} pax)</p>}
                        </div>
                        <p className="price">{formatPrice(total)} VND</p>
                    </div>

                    <button className="booknow" onClick={() => navigate("/booking")}>Continue to Booking</button>
                </div>
            </div>
        </div>
    );
};

export default Confirm;
