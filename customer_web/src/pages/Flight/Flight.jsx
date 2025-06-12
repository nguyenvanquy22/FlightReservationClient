import React from "react";
import { useEffect, useState, useContext } from 'react';
import './Flight.scss'
import Header from '../../components/Header/Header';
import OrderFlight from "../../components/OrderFlight/OrderFlight";
import Footer from "../../components/Footer/Footer";
import DepartureFlight from "../../components/DepartureFlight/DepartureFlight";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";

const Flight = () => {

    const { newFlights, filterByStops } = useContext(StoreContext);

    const [selectedTimes, setSelectedTimes] = useState([]);
    const timeRanges = [
        { label: "Early Flight", range: "00:00-06:00" },
        { label: "Morning Flight", range: "06:00-12:00" },
        { label: "Afternoon Flight", range: "12:00-18:00" },
        { label: "Night Flight", range: "18:00-24:00" }
    ]
    const [selectedStops, setSelectedStops] = useState(2);

    const handleTimeChange = (timeRange) => {
        setSelectedTimes(prevTimes =>
            prevTimes.includes(timeRange)
                ? prevTimes.filter(t => t !== timeRange)
                : [...prevTimes, timeRange]
        );
    };

    const handleStopsChange = (stops) => {
        setSelectedStops(stops);
        filterByStops(stops);
    };

    const prices = newFlights.flatMap(f =>
        f.seatOptions.map(o => o.seatPrice)
    );
    const globalMin = prices.length ? Math.min(...prices) : 0;
    const globalMax = prices.length ? Math.max(...prices) : 0;
    const [maxPrice, setMaxPrice] = useState(globalMax);

    useEffect(() => {
        setMaxPrice(globalMax);
    }, [globalMax]);

    const filterFlights = () => {
        let flights = newFlights;

        // time
        if (selectedTimes.length) {
            flights = flights.filter(f => {
                const hour = parseInt(f.departureTime.slice(11, 13), 10);
                return selectedTimes.some(r => {
                    const [s, e] = r.split('-').map(t => parseInt(t.slice(0, 2), 10));
                    return hour >= s && hour < e;
                });
            });
        }

        // price
        const filteredFlights = flights.reduce((result, flight) => {
            const validOptions = flight.seatOptions.filter(o => o.seatPrice <= maxPrice);
            if (validOptions.length > 0) {
                result.push({ ...flight, seatOptions: validOptions });
            }
            return result;
        }, []);

        return filteredFlights;
    };

    const filteredFlights = filterFlights(); // Chuyến bay đã lọc

    return (
        <div>
            <div className="Header">
                <Header />
                <OrderFlight />
                <div className="flight-container">
                    <div className="filter">
                        <div className="filter-reset">
                            <h3>Filter</h3>
                            <button
                                className="reset-button"
                                onClick={() => {
                                    setSelectedTimes([]);
                                    handleStopsChange(2);
                                    setMaxPrice(globalMax)
                                }}
                            >
                                Reset All
                            </button>
                        </div>
                        <div className="filter-price">
                            <h3>Price</h3>
                            <input
                                type="range"
                                min={globalMin}
                                max={globalMax}
                                step={100000}
                                value={maxPrice}
                                onChange={e => setMaxPrice(Number(e.target.value))}
                            />

                            <div className="price-labels">
                                <span>{globalMin.toLocaleString()} ₫</span>
                                <span>{maxPrice.toLocaleString()} ₫</span>
                            </div>
                        </div>
                        <hr />

                        <div className="filter-stop">
                            <h3>Stops</h3>
                            <div>
                                <input
                                    className="checkbox"
                                    type="radio"
                                    name="stops"
                                    value="0"
                                    checked={selectedStops === 0}
                                    onChange={() => handleStopsChange(0)}
                                />
                                Direct
                            </div>
                            <div>
                                <input
                                    className="checkbox"
                                    type="radio"
                                    name="stops"
                                    value="1"
                                    checked={selectedStops === 1}
                                    onChange={() => handleStopsChange(1)}
                                />
                                1 Stop
                            </div>
                            <div>
                                <input
                                    className="checkbox"
                                    type="radio"
                                    name="stops"
                                    value="2"
                                    checked={selectedStops === 2}
                                    onChange={() => handleStopsChange(2)}
                                />
                                All
                            </div>
                        </div>
                        <hr />

                        <div className="filter-stop">
                            <h3>Departure Time</h3>
                            {timeRanges.map(({ label, range }) => (
                                <div key={range}>
                                    <input
                                        className="checkbox"
                                        type="checkbox"
                                        checked={selectedTimes.includes(range)}
                                        onChange={() => handleTimeChange(range)}
                                    />
                                    {label}
                                    <p>{range}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="departure-flight">
                        {!filteredFlights.length ? (
                            <div className="no-flights">
                                <img src={assets.noFlight} alt="no flights" />
                                <h4>
                                    Sorry! No flights found
                                </h4>
                                <p>You can change the date or the filter to find another flight</p></div>
                        ) : (
                            <div>
                                {
                                    filteredFlights.map(flight => (
                                        <DepartureFlight key={flight.id} flight={flight} />
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    )
};

export default Flight;