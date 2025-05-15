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

    return (
        <div className="confirm-page">
            <h3>Trip Summary</h3>
            <div className="contain">
                {/* --- Left panel: flight-info --- */}
                <div className="flight-info">
                    {/* Departure */}
                    <div className="main-content">
                        <p>{selectedDepartureFlight.originAirport.city}</p>
                        <div>
                            <p>{'--'}</p>
                            <p>{'>'}</p>
                        </div>
                        <p>{selectedDepartureFlight.destinationAirport.city}</p>
                        <span className="basePrice">
                            {formatPrice(selectedSeatOption.seatPrice)} VND
                        </span>
                    </div>
                    <div className="transit-points">
                        <div className="aircraft">
                            <img src={assets.aircraftIcon1} className="svg" alt="" />
                            <p>{selectedDepartureFlight.airplane.airline.name}</p>
                        </div>
                        <div className="left-transit-points">
                            <div className="time">
                                <p>{formatTime(selectedDepartureFlight.departureTime)}</p>
                                <p>{formatDate(selectedDepartureFlight.departureTime)}</p>
                            </div>
                            <div className="arrow">
                                o<hr />v
                            </div>
                            <div className="time">
                                <p>{formatTime(selectedDepartureFlight.arrivalTime)}</p>
                                <p>{formatDate(selectedDepartureFlight.arrivalTime)}</p>
                            </div>
                        </div>
                        <div className="right-transit-points">
                            <div className="place">
                                <div>
                                    <p>{selectedDepartureFlight.originAirport.name}</p>
                                    <p>
                                        {selectedDepartureFlight.originAirport.city} -{" "}
                                        {selectedDepartureFlight.originAirport.country}
                                    </p>
                                </div>
                                <div className="time-place">
                                    <img src={assets.clock} alt="" />
                                    <p>
                                        {calculateDuration(
                                            selectedDepartureFlight.departureTime,
                                            selectedDepartureFlight.arrivalTime
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p>{selectedDepartureFlight.destinationAirport.name}</p>
                                    <p>
                                        {selectedDepartureFlight.destinationAirport.city} -{" "}
                                        {selectedDepartureFlight.destinationAirport.country}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Return (if round-trip) */}
                    {isRoundTrip && selectedReturnFlight && returnSeatOption && (
                        <>
                            <hr />
                            <div className="main-content">
                                <p>{selectedReturnFlight.originAirport.city}</p>
                                <div>
                                    <p>{'--'}</p>
                                    <p>{'>'}</p>
                                </div>
                                <p>{selectedReturnFlight.destinationAirport.city}</p>
                                <span className="basePrice">
                                    {formatPrice(returnSeatOption.seatPrice)} VND
                                </span>
                            </div>
                            <div className="transit-points">
                                <div className="aircraft">
                                    <img src={assets.aircraftIcon1} className="svg" alt="" />
                                    <p>{selectedReturnFlight.airplane.airline.name}</p>
                                </div>
                                <div className="left-transit-points">
                                    <div className="time">
                                        <p>{formatTime(selectedReturnFlight.departureTime)}</p>
                                        <p>{formatDate(selectedReturnFlight.departureTime)}</p>
                                    </div>
                                    <div className="arrow">
                                        o<hr />v
                                    </div>
                                    <div className="time">
                                        <p>{formatTime(selectedReturnFlight.arrivalTime)}</p>
                                        <p>{formatDate(selectedReturnFlight.arrivalTime)}</p>
                                    </div>
                                </div>
                                <div className="right-transit-points">
                                    <div className="place">
                                        <div>
                                            <p>{selectedReturnFlight.originAirport.name}</p>
                                            <p>
                                                {selectedReturnFlight.originAirport.city} -{" "}
                                                {selectedReturnFlight.originAirport.country}
                                            </p>
                                        </div>
                                        <div className="time-place">
                                            <img src={assets.clock} alt="" />
                                            <p>
                                                {calculateDuration(
                                                    selectedReturnFlight.departureTime,
                                                    selectedReturnFlight.arrivalTime
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p>{selectedReturnFlight.destinationAirport.name}</p>
                                            <p>
                                                {selectedReturnFlight.destinationAirport.city} -{" "}
                                                {selectedReturnFlight.destinationAirport.country}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* --- Right panel: passenger count & total --- */}
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

                    <button className="booknow" onClick={() => navigate("/booking")}>
                        Continue to Booking
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Confirm;
