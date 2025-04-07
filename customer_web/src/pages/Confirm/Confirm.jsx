import React, { useContext, useState } from "react";
import './Confirm.scss'
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import Footer from "../../components/Footer/Footer";
import { Link, useLocation } from 'react-router-dom';


const Confirm = () => {
    const { confirm, formatTime, calculateDuration,
        formatDate, countAdult, isRoundTrip, formatCurrency, totalPriceRoundTrip, setPriceRoundTrip } = useContext(StoreContext);

    const [adults, setAdults] = useState(1);
    const subtractAdult = () => {
        if (adults > 1) setAdults(adults - 1);
    }

    const totalPrice = (flight) => {
        // totalPriceRoundTrip(flight, adults)
        // let p = flight * adults * 0.80; 
        // setPriceRoundTrip(p);
        return totalPriceRoundTrip(confirm.reduce((sum, flight) => sum + flight.basePrice, 0), adults)
    }

    return (
        <div>
            <div className="confirm-page">
                <h3>Trip Summary</h3>
                <div className="contain">
                    <div className="list-tickets">
                        {confirm.map((flight, index) => (
                            <div key={index} >
                                {flight.transitPointList && flight.transitPointList.length > 0 ? (
                                    flight.transitPointList.map((transit, index1) => (
                                        <div key={index1} className="flight-info">
                                            <div>
                                                <div className="main-content">
                                                    <p>{flight.departureAirport.city}</p>
                                                    <div>
                                                        <p>{`--`} </p>
                                                        <p>{`>`}</p>
                                                    </div>
                                                    <p>{flight.arrivalAirport.city}</p>
                                                    <p className="basePrice">{formatCurrency(flight.basePrice)} VND</p>
                                                </div>
                                                <div className="transit-points">
                                                    <div className="aircraft">
                                                        <img className="svg" src={assets.aircraftIcon1}></img>
                                                        <p> {flight.airline.name}</p>
                                                    </div>
                                                    <div className="left-transit-points">
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
                                                    </div>

                                                    <div className="right-transit-points">
                                                        <div className="place">
                                                            <div>
                                                                <p>{flight.departureAirport.airportName}</p>
                                                                <p>{flight.departureAirport.city} - {flight.departureAirport.country}</p>
                                                            </div>
                                                            <div className="time-place">
                                                                <img src={assets.clock} />
                                                                <p>{calculateDuration(flight.departureTime, transit.arrivalTime)}</p>
                                                            </div>
                                                            <div>
                                                                <div>
                                                                    <p>{transit.airport.airportName}</p>
                                                                    <p>{transit.airport.city} - {transit.airport.country}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="note-transit-points">
                                                    <div className="time-place">
                                                        <img src={assets.clock} />
                                                        <p>Layover: {calculateDuration(transit.arrivalTime, transit.departureTime)} in {transit.airport.airportName}</p>
                                                    </div>
                                                    <div className="time-place">
                                                        <img src={assets.visa} />
                                                        <p>Travel document or transit visa might be required</p>
                                                    </div>
                                                </div>
                                                <div className="transit-points">
                                                    <div className="aircraft">
                                                        <img className="svg" src={assets.aircraftIcon1}></img>
                                                        <p> {flight.airline.name}</p>
                                                    </div>
                                                    <div className="left-transit-points">
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
                                                    <div className="right-transit-points">
                                                        <div className="place">
                                                            <div>
                                                                <div>
                                                                    <p>{transit.airport.airportName}</p>
                                                                    <p>{transit.airport.city} - {transit.airport.country}</p>
                                                                </div>
                                                            </div>
                                                            <div className="time-place">
                                                                <img src={assets.clock} />
                                                                <p>{calculateDuration(transit.departureTime, flight.arrivalTime)}</p>
                                                            </div>
                                                            <div>
                                                                <p>{flight.arrivalAirport.airportName}</p>
                                                                <p>{flight.arrivalAirport.city} - {flight.departureAirport.country}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="additional-information">
                                                <div>
                                                    <img src={assets.valiHand} />
                                                    <p>Cabin Baggage 7kg</p>
                                                </div>
                                                <div>
                                                    <img src={assets.vali} />
                                                    <p>Checked Baggage 25kg</p>
                                                </div>
                                                <div>
                                                    <img src={assets.refund} />
                                                    <p>Refundable</p>
                                                </div>
                                                <div>
                                                    <img src={assets.refund} />
                                                    <p>Reschedulable </p>
                                                </div>
                                                <div className="space">
                                                </div>
                                                <div>
                                                    <img src={assets.valiHand} />
                                                    <p>Cabin Baggage 7kg</p>
                                                </div>
                                                <div>
                                                    <img src={assets.vali} />
                                                    <p>Checked Baggage 25kg</p>
                                                </div>
                                                <div>
                                                    <img src={assets.refund} />
                                                    <p>Refundable</p>
                                                </div>
                                                <div>
                                                    <img src={assets.refund} />
                                                    <p>Reschedulable </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div key={index} className="flight-info">
                                        <div>
                                            <div className="main-content">
                                                <p>{flight.departureAirport.city}</p>
                                                <div>
                                                    <p>{`--`} </p>
                                                    <p>{`>`}</p>
                                                </div>
                                                <p>{flight.arrivalAirport.city}</p>
                                                <p className="basePrice">{formatCurrency(flight.basePrice)} VND</p>
                                            </div>
                                            <div className="transit-points">
                                                <div className="aircraft">
                                                    <img className="svg" src={assets.aircraftIcon1}></img>
                                                    <p> {flight.airline.name}</p>
                                                </div>
                                                <div className="left-transit-points">
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
                                                            <p>{formatTime(flight.arrivalTime)} </p>
                                                            <p>{formatDate(flight.arrivalTime)}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div key={index} className="right-transit-points">
                                                    <div className="place">
                                                        <div>
                                                            <p>{flight.departureAirport.airportName}</p>
                                                            <p>{flight.departureAirport.city} - {flight.departureAirport.country}</p>
                                                        </div>
                                                        <div className="time-place">
                                                            <img src={assets.clock} />
                                                            <p>{calculateDuration(flight.departureTime, flight.arrivalTime)}</p>
                                                        </div>
                                                        <div>
                                                            <div>
                                                                <p>{flight.arrivalAirport.airportName}</p>
                                                                <p>{flight.arrivalAirport.city} - {flight.departureAirport.country}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="additional-information">
                                            <div>
                                                <img src={assets.valiHand} />
                                                <p>Cabin Baggage 7kg</p>
                                            </div>
                                            <div>
                                                <img src={assets.vali} />
                                                <p>Checked Baggage 25kg</p>
                                            </div>
                                            <div>
                                                <img src={assets.refund} />
                                                <p>Refundable</p>
                                            </div>
                                            <div>
                                                <img src={assets.refund} />
                                                <p>Reschedulable </p>
                                            </div>
                                        </div>
                                    </div>
                                    // <h1>Direct Flight</h1>
                                )}
                                {/* <div className="right">
                                    <h2>Price Detail </h2>
                                    <p>(Default is ECONOMY)</p>
                                    <hr />
                                    <div className="adult-count">
                                        <p>Adults</p>
                                        <div>
                                            <button onClick={() => subtractAdult()}>-</button>
                                            <p>{adults}</p>
                                            <button onClick={() => { if (adults < 10) { setAdults(adults + 1) } }}>+</button>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="total-price">
                                        <div>
                                            <p>Total Price</p>
                                            <p>(For {adults} pax)</p>
                                        </div>
                                        <p className="price">{totalPrice(flight.basePrice)} VND</p>
                                    </div>
                                    <Link to="/booking">
                                        <button className="booknow" onClick={() => countAdult(adults)}>Book Now</button>
                                    </Link>
                                </div> */}
                            </div>
                        ))}
                    </div>
                    <div className="right">
                        <h2>Price Detail </h2>
                        <p>(Default is ECONOMY)</p>
                        <hr />
                        <div className="adult-count">
                            <p>Adults</p>
                            <div>
                                <button onClick={() => subtractAdult()}>-</button>
                                <p>{adults}</p>
                                <button onClick={() => { if (adults < 10) { setAdults(adults + 1) } }}>+</button>
                            </div>
                        </div>
                        <hr />
                        <div className="total-price">
                            <div>
                                <p>Total Price</p>
                                {!isRoundTrip ? (
                                    <p>(For {adults} pax)</p>
                                ) : (
                                    <p>20% off</p>
                                )}
                            </div>
                            {confirm.length == 1 ? (
                                confirm.map((flight, index) => (
                                    <p key={index} className="price">{formatCurrency(totalPrice(flight.basePrice))} VND</p>
                                ))
                            ) : (
                                <p className="price">
                                    {formatCurrency(totalPrice())} VND
                                </p>
                            )}
                        </div>
                        <Link to="/booking">
                            <button className="booknow" onClick={() => countAdult(adults)}>Book Now</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Confirm