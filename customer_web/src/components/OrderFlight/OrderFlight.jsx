import React, { useRef, useEffect, useState, useContext } from "react";
import './OrderFlight.scss'
import { Link, Route, Routes } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const OrderFlight = () => {
    const [showOrigin, setShowOrigin] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [flight, setFlight] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');

    const { place, searchFlights, place1, place2, isRoundTrip, setIsRoundTrip, searchTermReturn } = useContext(StoreContext);

    useEffect(() => {
        if (place1 && place2) {
            setFlight(place1);
            setDestination(place2);
            searchFlights(place1, place2, departureDate, returnDate);
        }
    }, []);

    const handleFlightChange = (e) => {
        setFlight(e);
        setShowOrigin(false);
    }

    const handleDestinationChange = (e) => {
        setDestination(e);
        setShowSuggestions(false);
    }

    function useOutsideAlerter(ref, handler) {
        useEffect(() => {
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    handler();
                }
            }

            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [ref, handler]);
    }

    const handleSearch = () => {
        sessionStorage.setItem('departureDate', departureDate);
        sessionStorage.setItem('returnDate', returnDate);
        searchFlights(flight, destination, departureDate, returnDate);
    };

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, () => setPasenger(false));

    return (

        <div className="order">
            <div className="order-itinerary">
                <button className={`itinerary ${!isRoundTrip ? 'itinerary__active' : ''}`}
                    onClick={() => {

                        setIsRoundTrip(false)
                    }}>
                    One way
                </button>
                <button className={`itinerary ${isRoundTrip ? 'itinerary__active' : ''}`}
                    onClick={() => {

                        setIsRoundTrip(true)
                    }}>
                    Round trip
                </button>
            </div>
            <div className="order-flight">
                <div className="flight">
                    <div className="origin airport-select">
                        <p>From</p>
                        <input
                            name='origin'
                            type="text"
                            placeholder="Origin"
                            value={flight}
                            onChange={(e) => handleFlightChange(e.target.value)}
                            onFocus={() => {
                                setShowOrigin(true)
                                setShowSuggestions(false)
                            }}
                            onBlur={() => {
                                setTimeout(() => setShowOrigin(false), 300);
                            }}
                            required
                        />
                        {showOrigin && (
                            <ul className="suggestion">
                                {place.map((item, index) => (
                                    <div key={index}>
                                        <li onClick={() => handleFlightChange(item.city)}>
                                            {item.city}
                                        </li>
                                    </div>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="destination airport-select">
                        <p>To</p>
                        <input
                            name='destinational'
                            type="text"
                            placeholder="Destination"
                            value={destination}
                            onChange={(e) => handleDestinationChange(e.target.value)}
                            onFocus={() => {
                                setShowOrigin(false)
                                setShowSuggestions(true)
                            }}
                            onBlur={() => {
                                setTimeout(() => setShowSuggestions(false), 300);
                            }}
                            required
                        />
                        {showSuggestions && (
                            <ul className="suggestion">
                                {place.map((item, index) => (
                                    <div key={index}>
                                        <li onClick={() => handleDestinationChange(item.city)}>
                                            {item.city}
                                        </li>
                                    </div>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="departure time-select">
                        <p>Departure</p>
                        <input
                            name='Departure'
                            type="date"
                            placeholder="Mon, 2 Sep"
                            required
                            value={departureDate}
                            onChange={(e) => setDepartureDate(e.target.value)} // Update the state
                        />
                    </div>
                    {isRoundTrip && (
                        <div className="return time-select">
                            <p>Return</p>
                            <input
                                name='Return'
                                type="date"
                                placeholder="Mon, 2 Sep"
                                required
                                value={returnDate}
                                onChange={(e) => setReturnDate(e.target.value)} // Update the state
                            />
                        </div>
                    )}
                    <div>
                        <Link to="/flight"><button className="search" onClick={handleSearch}>Search</button></Link>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default OrderFlight