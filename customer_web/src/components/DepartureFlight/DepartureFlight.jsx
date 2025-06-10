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
    const [filteredSeatOptions, setFilteredSeatOptions] = useState([]);

    useEffect(() => {
        setFilteredSeatOptions(flight.seatOptions.filter(option => option.availableSeats > 0));
    }, [flight]);

    const chosenFlight = async (flight, seatOption, isReturn) => {
        await selectFlight(flight, isReturn);
        await selectSeatOption(seatOption, isReturn);
    };

    const handleSelect = () => {
        setIsSelected(!isSelected);
    };

    const minPrice = filteredSeatOptions.reduce((min, option) => {
        return option.seatPrice < min ? option.seatPrice : min;
    }, filteredSeatOptions[0]?.seatPrice || 0);

    // 1. Trước return của component, xác định các segment chuyến bay
    const buildSegments = (flight, place) => {
        const segments = [];
        const { transits = [] } = flight;

        // helper lấy thông tin airport từ transit
        const getAirport = (airportId) =>
            place.find((a) => a.id === airportId) || {};

        if (transits.length >= 1) {
            // segment đầu: departure -> transit1
            segments.push({
                fromTime: flight.departureTime,
                toTime: transits[0].arrivalTime,
                fromAirport: flight.originAirport,
                toAirport: getAirport(transits[0].airportId),
                departureTime: transits[0].departureTime,    // chuẩn bị cho next
                arrivalTime: transits[0].arrivalTime,
                airportId: transits[0].airportId,
            });

            if (transits.length === 2) {
                // segment giữa: transit1 -> transit2
                segments.push({
                    fromTime: transits[0].departureTime,
                    toTime: transits[1].arrivalTime,
                    fromAirport: getAirport(transits[0].airportId),
                    toAirport: getAirport(transits[1].airportId),
                    departureTime: transits[1].departureTime,
                    arrivalTime: transits[1].arrivalTime,
                    airportId: transits[1].airportId,
                });
                // segment cuối: transit2 -> arrival
                segments.push({
                    fromTime: transits[1].departureTime,
                    toTime: flight.arrivalTime,
                    fromAirport: getAirport(transits[1].airportId),
                    toAirport: flight.destinationAirport,
                });
            } else {
                // chỉ 1 transit: segment cuối: transit1 -> arrival
                segments.push({
                    fromTime: transits[0].departureTime,
                    toTime: flight.arrivalTime,
                    fromAirport: getAirport(transits[0].airportId),
                    toAirport: flight.destinationAirport,
                });
            }
        }
        return segments;
    };

    // 2. Nhóm segments thành “cột”
    const groupColumns = (segments, transitCount) => {
        if (transitCount === 1) {
            return [segments];               // 1 cột chứa 2 segments
        }
        if (transitCount === 2) {
            return [
                segments.slice(0, 2),            // cột 1: 2 segments đầu
                segments.slice(2)                // cột 2: segment cuối
            ];
        }
        return [];
    };

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
                {filteredSeatOptions.map((option) => (
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
                {flight.transits && flight.transits.length > 0 && (() => {
                    const segments = buildSegments(flight, place);
                    const columns = groupColumns(segments, flight.transits.length);

                    return (
                        <div className="transit-points">
                            {columns.map((colSegs, colIdx) => (
                                <div key={colIdx} className="transit-point">
                                    {/* Left: hiển thị time flow */}
                                    <div className="left-transit-point">
                                        {colSegs.map((seg, i) => (
                                            <React.Fragment key={i}>
                                                <div className="time">
                                                    <p>{formatTime(seg.fromTime)}</p>
                                                    <p>{formatDate(seg.fromTime)}</p>
                                                </div>
                                                <div className="arrow">
                                                    o <hr /> v
                                                </div>
                                                <div className="time">
                                                    <p>{formatTime(seg.toTime)}</p>
                                                    <p>{formatDate(seg.toTime)}</p>
                                                </div>
                                                {/* Nếu có thêm segment nữa trong cùng cột, tạo dòng mới */}
                                                {i < colSegs.length - 1 && <br />}
                                            </React.Fragment>
                                        ))}
                                    </div>

                                    {/* Right: hiển thị place + duration */}
                                    <div className="right-transit-point">
                                        {colSegs.map((seg, i) => (
                                            <div key={i} className="place">
                                                {/* From */}
                                                <div>
                                                    <p>{seg.fromAirport?.name}</p>
                                                    <p>{seg.fromAirport?.city} - {seg.fromAirport?.country}</p>
                                                </div>
                                                {/* Duration */}
                                                <div className="time-place">
                                                    <img src={assets.clock} alt="duration" />
                                                    <p>{calculateDuration(seg.fromTime, seg.toTime)}</p>
                                                </div>
                                                {/* To */}
                                                <div>
                                                    <p>{seg.toAirport?.name}</p>
                                                    <p>{seg.toAirport?.city} - {seg.toAirport?.country}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })()}
            </div>
        </div>
    );
};

export default DepartureFlight;
