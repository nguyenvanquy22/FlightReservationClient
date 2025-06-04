import React, { useState, useContext, useEffect } from "react";
import './DepartureFlight.scss';
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const DepartureFlight = ({ flight }) => {
    const [isSelected, setIsSelected] = useState(false);
    const { selectFlight, selectSeatOption, formatTime, calculateDuration, place,
        formatDate, calculateDaysOvernight, formatPrice, isRoundTrip, setIsRoundTrip,
        place1, place2, searchReturnFlights, selectedDepartureFlight,
    } = useContext(StoreContext);

    const chosenFlight = async (flight, seatOption, isReturn) => {
        await selectFlight(flight, isReturn);
        await selectSeatOption(seatOption, isReturn);
    };

    const handleSelect = () => {
        setIsSelected(!isSelected);
    };

    const minPrice = flight.seatOptions.reduce((min, option) => {
        return option.seatPrice < min ? option.seatPrice : min;
    }, flight.seatOptions[0]?.seatPrice || 0);

    return (
        <div className="departureFlight">
            <div className="item">
                <div className="item-info">
                    <div className="seat-class">
                        <p>{flight.flightNumber}</p>
                    </div>
                    <div className="airline">
                        <p>{flight.airplane.airline.name}</p>
                    </div>
                </div>
                <div className="item-info-time">
                    <div>
                        <p>{formatTime(flight.departureTime)}</p>
                        <p className="code">{flight.originAirport.iataCode}</p>
                    </div>
                    <div className="time">
                        {calculateDuration(flight.departureTime, flight.arrivalTime)}
                        {flight.transits && flight.transits.length > 0 ? (
                            <div>{`o----------o--------->`}</div> // Có transit point
                        ) : (
                            <div>{`o--------------------->`}</div> // Không có transit point
                        )}
                    </div>
                    <div className="arrivalTime">
                        <div className="arrivalTime-item">
                            <p>{formatTime(flight.arrivalTime)}</p>
                            {calculateDaysOvernight(flight.departureTime, flight.arrivalTime) != 0 ? <p className="overNight">+{calculateDaysOvernight(flight.departureTime, flight.arrivalTime)}d</p> : null}
                        </div>
                        <p className="code">{flight.destinationAirport.iataCode}</p>
                    </div>
                </div>
                <div className="item-info">
                    <p>{formatPrice(minPrice || 0)} VND</p>
                    <button className="select" onClick={handleSelect}>
                        {isSelected ? 'Close' : 'Select'}
                    </button>
                </div>
            </div>
            <div className={`ticket-show ${isSelected ? 'ticket-show-active' : ''}`}>
                {/* Hiển thị hoặc ẩn div "selected" */}
                {flight.seatOptions.map((option, index) => (
                    <div key={option.id} className="selected">
                        <div className="seat">
                            <img src={assets.seat}></img>
                            <p className="hightline">{option.seatClassName} class</p>
                        </div>
                        <hr />
                        <div className="price">
                            <p className="hightline"> {formatPrice(option?.seatPrice || 0)} VND</p>
                            <p>Price / Pax</p>
                        </div>
                        <div className="aircraft">
                            <img className="svg" src={assets.aircraftIcon1}></img>
                            <p> {flight.airplane.airline.name}</p>
                        </div>
                        <div className="departure-info">
                            <p className="place">{formatTime(flight.departureTime)} - {formatDate(flight.departureTime)}</p>
                            <p> {flight.originAirport.name}</p>
                            <p>({flight.originAirport.city}-{flight.originAirport.country})</p>
                        </div>
                        <div className="arrival-info">
                            <p className="place">{formatTime(flight.arrivalTime)} - {formatDate(flight.arrivalTime)}  </p>
                            <p>{flight.destinationAirport.name}</p>
                            <p>({flight.destinationAirport.city}-{flight.destinationAirport.country})</p>
                        </div>
                        <div className="cabin-bag">
                            <img className="bag" src={assets.bag}></img>
                            <p>Cabin Baggage 7kg</p>
                        </div>
                        {isRoundTrip ? (
                            !selectedDepartureFlight ? (
                                <button onClick={() => {
                                    chosenFlight(flight, option, false)
                                    searchReturnFlights(place2, place1, flight?.arrivalTime, sessionStorage.getItem('returnDate'));
                                }}
                                    className="book">
                                    Book The Departure
                                </button>
                            ) : (
                                <Link to="/confirm">
                                    <button onClick={() => chosenFlight(flight, option, true)} className="book">
                                        Book The Return
                                    </button>
                                </Link>
                            )
                        ) : (
                            <Link to="/confirm">
                                <button
                                    onClick={() => { chosenFlight(flight, option, false) }}
                                    className="book"
                                >
                                    Book Now
                                </button>
                            </Link>
                        )}

                    </div>
                ))}
                {/* Hiển thị bảng TransitPoint nếu có */}
                {flight.transits && flight.transits.length > 0 && (
                    <div className="transit-points">
                        {flight.transits.map((transit, index) => (
                            <div key={index} className="transit-point">

                                <div className="left-transit-point">
                                    <div className="time">
                                        <div>
                                            <p>{formatTime(flight.departureTime)}</p>
                                            <p>{formatDate(flight.departureTime)}</p>
                                        </div>
                                    </div>
                                    <div className="arrow">
                                        {`o`} <hr /> v
                                    </div>
                                    <div>
                                        <div className="time">
                                            <p>{formatTime(transit.arrivalTime)}</p>
                                            <p>{formatDate(transit.arrivalTime)}</p>
                                        </div>
                                    </div>
                                    <br />
                                    <div className="time">
                                        <div className="time">
                                            <p>{formatTime(transit.departureTime)}</p>
                                            <p>{formatDate(transit.departureTime)}</p>
                                        </div>
                                    </div>
                                    <div className="arrow">
                                        {`o`} <hr /> v
                                    </div>
                                    <div className="time">
                                        <p>{formatTime(flight.arrivalTime)} </p>
                                        <p>{formatDate(flight.arrivalTime)}</p>
                                    </div>
                                </div>

                                <div className="right-transit-point">
                                    <div className="place">
                                        <div>
                                            <p>{flight.originAirport?.name}</p>
                                            <p>{flight.originAirport?.city} - {flight.originAirport?.country}</p>
                                        </div>
                                        <div className="time-place">
                                            <img src={assets.clock} />
                                            <p>{calculateDuration(flight.departureTime, transit.arrivalTime)}</p>
                                        </div>
                                        <div>
                                            <p>{place.find((airport) => airport.id === transit.airportId)?.name}</p>
                                            <p>{place.find((airport) => airport.id === transit.airportId)?.city} - {place.find((airport) => airport.id === transit.airportId)?.country}</p>
                                        </div>
                                    </div>
                                    <div className="place">
                                        <div>
                                            <p>{place.find((airport) => airport.id === transit.airportId)?.name}</p>
                                            <p>{place.find((airport) => airport.id === transit.airportId)?.city} - {place.find((airport) => airport.id === transit.airportId)?.country}</p>
                                        </div>
                                        <div className="time-place">
                                            <img src={assets.clock} />
                                            <p>{calculateDuration(transit.departureTime, flight.arrivalTime)}</p>
                                        </div>
                                        <div>
                                            <p>{flight.destinationAirport?.name}</p>
                                            <p>{flight.destinationAirport?.city} - {flight.destinationAirport?.country}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DepartureFlight;
