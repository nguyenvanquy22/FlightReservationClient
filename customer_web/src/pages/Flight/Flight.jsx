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

    const { flights, newFlights, filterStop } = useContext(StoreContext);

    const [selectedTimes, setSelectedTimes] = useState([]);
    const timeRanges = [
        { label: "Early Flight", range: "00:00-06:00" },
        { label: "Morning Flight", range: "06:00-12:00" },
        { label: "Afternoon Flight", range: "12:00-18:00" },
        { label: "Night Flight", range: "18:00-24:00" }
    ]

    const handleTimeChange = (timeRange) => {
        setSelectedTimes(prevTimes =>
            prevTimes.includes(timeRange)
                ? prevTimes.filter(t => t !== timeRange)
                : [...prevTimes, timeRange]
        );
        // console.log("time", timeRange);
    };

    const filterFlights = () => {
        if (selectedTimes.length === 0) {

            return newFlights; // Nếu không chọn gì thì hiển thị tất cả chuyến bay
        }

        console.log("selectedTimes", selectedTimes);
        return newFlights.filter(flight => {
            const flightTime = new Date(flight.departureTime).toTimeString().slice(0, 5); // Chuyển thời gian khởi hành thành dạng "HH:MM"
            return selectedTimes.some(timeRange => {
                if (typeof timeRange !== 'string') {
                    console.error('Invalid time range:', timeRange);
                    return false;
                }
                const [start, end] = timeRange.split('-');
                const start1 = parseInt(start.slice(0, 2));
                const end1 = parseInt(end.slice(0, 2));
                const flightTime1 = parseInt(flightTime.slice(0, 2));
                // console.log("start", typeof(start1), start1, "end", end1, "flightTime", typeof(flightTime1), flightTime1);
                return flightTime1 >= start1 && flightTime1 < end1;
            });

        });
    };

    const filteredFlights = filterFlights(); // Chuyến bay đã lọc



    // useEffect(() => {
    //     setSelectedTimes(newFlights);
    //     console.log("selectedTimes", selectedTimes);
    // }, [selectedTimes]);



    return (
        <div>
            <div className="Header">
                <Header />
                <OrderFlight />
                <div className="flight-container">
                    <div className="filter">
                        <div className="filter-reset">
                            <h3>Filter</h3>
                            <button>Reset All</button>
                        </div>
                        <div className="filter-price">
                            <h3>Price</h3>
                            <div>Range Price</div>
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
                                    onChange={() => filterStop(0)}
                                />
                                Direct
                            </div>
                            <div>
                                <input
                                    className="checkbox"
                                    type="radio"
                                    name="stops"
                                    value="1"
                                    onChange={() => filterStop(1)}
                                />
                                1 Stop
                            </div>
                            <div>
                                <input
                                    className="checkbox"
                                    type="radio"
                                    name="stops"
                                    value="2"
                                    onChange={() => filterStop(2)}
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
                                        <DepartureFlight key={flight.flightId} flight={flight} />
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