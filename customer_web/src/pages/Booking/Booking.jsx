import React, { useContext, useState } from "react";
import './Booking.scss';
import { StoreContext } from "../../context/StoreContext";
import Footer from "../../components/Footer/Footer";
// import { Link } from "react-router-dom";
// import axios from "axios";

const Booking = () => {
    const { confirm, adults, postBooking, formatTime, formatDate, urlPaymen, formatPrice, isRoundTrip, totalPriceRoundTrip, priceRoundTrip, user } = useContext(StoreContext);

    // Khởi tạo state cho hành khách
    const [passengers, setPassengers] = useState(
        Array.from({ length: adults }, () => ({
            firstName: "",
            lastName: "",
            passportNumber: "",
            dateOfBirth: "1990-01-01", // Giá trị mặc định
            seatClass: "ECONOMY",
            luggage: "0", // Giá trị mặc định là không có hành lý
        }))
    );

    const [block, setBlock] = useState(false);

    // Xử lý thay đổi thông tin hành khách
    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const updatedPassengers = passengers.map((passenger, i) =>
            i === index ? { ...passenger, [name]: value } : passenger
        );
        setPassengers(updatedPassengers);
    };

    // Hàm tính giá cho từng hành khách
    const calculateTotalPrice = (basePrice, seatClass, luggage) => {
        let seatClassPrice = 0;
        let luggagePrice = 0;

        // Tính giá ghế
        if (seatClass === "BUSINESS") {
            seatClassPrice = basePrice * 2;
        } else if (seatClass === "FIRST") {
            seatClassPrice = basePrice * 3;
        }

        // Tính giá hành lý
        if (luggage === "20") {
            luggagePrice = 300000;
        } else if (luggage === "30") {
            luggagePrice = 400000;
        } else if (luggage === "40") {
            luggagePrice = 700000;
        } else if (luggage === "50") {
            luggagePrice = 1000000;
        }

        // Tổng giá = basePrice + seatClassPrice + luggagePrice
        if (luggage === "0" && seatClass === "ECONOMY") {
            return basePrice;
        }
        else if (luggage === "0" && seatClass !== "ECONOMY") {
            return seatClassPrice;
        }
        else if (luggage !== "0" && seatClass === "ECONOMY") {
            return basePrice + luggagePrice;
        }
        else return seatClassPrice + luggagePrice;
    };

    // Hàm lấy số lượng vé cho mỗi loại ghế
    const getTicketTypeCounts = () => {
        const counts = { economy: 0, business: 0, first: 0 };

        passengers.forEach((passenger) => {
            if (passenger.seatClass === "ECONOMY") {
                counts.economy += 1;
            } else if (passenger.seatClass === "BUSINESS") {
                counts.business += 1;
            } else if (passenger.seatClass === "FIRST") {
                counts.first += 1;
            }
        });

        return counts;
    };


    // let price = 0;
    // confirm.forEach((flight) => {
    //     price += flight.basePrice;
    // });

    // price = price * 0.8;

    // const totalPrice = (flight) => {
    //     if (!isRoundTrip) {
    //         return flight * adults;
    //     }
    //     return flight * adults * 0.80;
    // }

    return (
        <div>
            <div className="booking-page">
                {!isRoundTrip ? (
                    confirm.map((flight) =>
                        <div key={flight.id} className="contain">
                            <div className="depart">
                                <h2>
                                    {flight.originAirport.city} ({flight.originAirport.country}) - {flight.destinationAirport.city} ({flight.destinationAirport.country})
                                </h2>
                                <p>
                                    {formatTime(flight.departureTime)} - {formatDate(flight.departureTime)} |
                                    {formatTime(flight.arrivalTime)} - {formatDate(flight.arrivalTime)} |
                                    {flight.transitPointList && flight.transitPointList.length > 0 ? '1 transitpoint' : 'Direct'}
                                </p>
                            </div>
                            <div className="passenger-details">
                                {passengers.map((passenger, index) => {
                                    const totalPrice = calculateTotalPrice(flight?.basePrice || 0, passenger.seatClass, passenger.luggage);
                                    return (
                                        <div key={index} className="form-info">
                                            <h3>Passenger {index + 1}</h3>

                                            <div className="input-info">
                                                <div>
                                                    <label>First Name</label>
                                                    <input
                                                        type="text"
                                                        name="firstName"
                                                        value={passenger.firstName}
                                                        onChange={(e) => handleChange(index, e)}
                                                    />
                                                </div>
                                                <div>
                                                    <label>Last Name</label>
                                                    <input
                                                        type="text"
                                                        name="lastName"
                                                        value={passenger.lastName}
                                                        onChange={(e) => handleChange(index, e)}
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
                                                        onChange={(e) => handleChange(index, e)}
                                                    />
                                                </div>
                                                <div>
                                                    <label>Date of Birth</label>
                                                    <input
                                                        type="date"
                                                        name="dateOfBirth"
                                                        value={passenger.dateOfBirth}
                                                        onChange={(e) => handleChange(index, e)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="input-info-seat-class">
                                                <label>Class</label>
                                                <select
                                                    className="seat-class"
                                                    name="seatClass"
                                                    value={passenger.seatClass}
                                                    onChange={(e) => handleChange(index, e)}
                                                >
                                                    <option value="ECONOMY">Economy</option>
                                                    <option value="BUSINESS">Business</option>
                                                    <option value="FIRST">First</option>
                                                </select>
                                                <label>Luggage</label>
                                                <select
                                                    className="seat-class"
                                                    name="luggage"
                                                    value={passenger.luggage}
                                                    onChange={(e) => handleChange(index, e)}
                                                >
                                                    <option value="0">No luggage</option>
                                                    <option value="20">20kg</option>
                                                    <option value="30">30kg</option>
                                                    <option value="40">40kg</option>
                                                    <option value="50">50kg</option>
                                                </select>
                                                <p className="base-price" >{formatPrice(totalPrice)} VND</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )
                )
                    : (
                        <div className="contain">
                            <div className="depart-round_trip">
                                {
                                    confirm.map((flight, index) =>
                                        <div key={index}>
                                            <h2>
                                                {flight.originAirport.city} ({flight.originAirport.country}) - {flight.destinationAirport.city} ({flight.destinationAirport.country})
                                            </h2>
                                            <p>
                                                {formatTime(flight.departureTime)} - {formatDate(flight.departureTime)} | {` `}
                                                {formatTime(flight.arrivalTime)} - {formatDate(flight.arrivalTime)} | {` `}
                                                {flight.transitPointList && flight.transitPointList.length > 0 ? '1 transitpoint' : 'Direct'}
                                            </p>
                                            <br />
                                        </div>
                                    )
                                }
                            </div>

                            <div className="passenger-details">
                                {passengers.map((passenger, index) => {
                                    const totalPrice = calculateTotalPrice(priceRoundTrip, passenger.seatClass, passenger.luggage);
                                    return (
                                        <div key={index} className="form-info">
                                            <h3>Passenger {index + 1}</h3>

                                            <div className="input-info">
                                                <div>
                                                    <label>First Name</label>
                                                    <input
                                                        type="text"
                                                        name="firstName"
                                                        value={passenger.firstName}
                                                        onChange={(e) => handleChange(index, e)}
                                                    />
                                                </div>
                                                <div>
                                                    <label>Last Name</label>
                                                    <input
                                                        type="text"
                                                        name="lastName"
                                                        value={passenger.lastName}
                                                        onChange={(e) => handleChange(index, e)}
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
                                                        onChange={(e) => handleChange(index, e)}
                                                    />
                                                </div>
                                                <div>
                                                    <label>Date of Birth</label>
                                                    <input
                                                        type="date"
                                                        name="dateOfBirth"
                                                        value={passenger.dateOfBirth}
                                                        onChange={(e) => handleChange(index, e)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="input-info-seat-class">
                                                <label>Class</label>
                                                <select
                                                    className="seat-class"
                                                    name="seatClass"
                                                    value={passenger.seatClass}
                                                    onChange={(e) => handleChange(index, e)}
                                                >
                                                    <option value="ECONOMY">Economy</option>
                                                    <option value="BUSINESS">Business</option>
                                                    <option value="FIRST">First</option>
                                                </select>
                                                <label>Luggage</label>
                                                <select
                                                    className="seat-class"
                                                    name="luggage"
                                                    value={passenger.luggage}
                                                    onChange={(e) => handleChange(index, e)}
                                                >
                                                    <option value="0">No luggage</option>
                                                    <option value="20">20kg</option>
                                                    <option value="30">30kg</option>
                                                    <option value="40">40kg</option>
                                                    <option value="50">50kg</option>
                                                </select>
                                                {/* <p className="base-price" >{formatPrice(price)} VND</p> */}
                                                <p className="base-price" >{formatPrice(totalPrice)} VND</p>

                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                <div className="submit">
                    <h3>Total Price </h3>
                    <p>(for {adults} pax)</p>
                    <h3 className="total-price">
                        {isRoundTrip
                            // ? formatPrice(totalPrice(confirm.reduce((sum, flight) => sum + flight.basePrice, 0)))
                            // ? formatPrice(confirm.reduce((total, flight) => total + passengers.reduce((total, passenger) => total + calculateTotalPrice(confirm[0].basePrice, passenger.seatClass, passenger.luggage), 0)) )
                            // ? formatPrice(priceRoundTrip * adults) 
                            ? formatPrice(passengers.reduce((total, passenger) => total + calculateTotalPrice(priceRoundTrip, passenger.seatClass, passenger.luggage), 0))
                            : formatPrice(passengers.reduce((total, passenger) => total + calculateTotalPrice(confirm[0]?.basePrice || 0, passenger.seatClass, passenger.luggage), 0))
                        }
                        {` `}VND
                        {/* {formatCurrency(totalPrice(confirm.reduce((sum, flight) => sum + flight.basePrice, 0)))} VND */}
                        {/* {formatPrice(passengers.reduce((total, passenger) => total + calculateTotalPrice(confirm[0].basePrice, passenger.seatClass, passenger.luggage), 0))} VND */}
                    </h3>
                    <button className={`booking ${block ? 'block' : ''}`} onClick={() => {
                        console.log("isRoundTrip: ", isRoundTrip);
                        const ticketCounts = getTicketTypeCounts();
                        const bookingTicketTypes = [];

                        if (ticketCounts.economy > 0) {
                            bookingTicketTypes.push({ ticketTypeId: 1, quantity: ticketCounts.economy });
                        }
                        if (ticketCounts.business > 0) {
                            bookingTicketTypes.push({ ticketTypeId: 2, quantity: ticketCounts.business });
                        }
                        if (ticketCounts.first > 0) {
                            bookingTicketTypes.push({ ticketTypeId: 3, quantity: ticketCounts.first });
                        }

                        setBlock(true);

                        {
                            !isRoundTrip ?
                                postBooking({
                                    userId: localStorage.getItem("userId"),  // Giả định userId là 1
                                    flightId: confirm[0].id,
                                    bookingTicketTypes,
                                    passengers: passengers.map(p => ({
                                        firstName: p.firstName,
                                        lastName: p.lastName,
                                        passportNumber: p.passportNumber,
                                        dateOfBirth: p.dateOfBirth,
                                        seatClass: p.seatClass,
                                        luggage: p.luggage ? { weight: p.luggage, type: "checked" } : null,
                                    })),
                                    luggage: passengers
                                        .filter(p => p.luggage && p.luggage !== "0")
                                        .map(p => {
                                            let luggagePrice = 0;

                                            // Tính giá hành lý dựa trên số kg
                                            if (p.luggage === "20") {
                                                luggagePrice = 300000;
                                            } else if (p.luggage === "30") {
                                                luggagePrice = 400000;
                                            } else if (p.luggage === "40") {
                                                luggagePrice = 700000;
                                            } else if (p.luggage === "50") {
                                                luggagePrice = 1000000;
                                            }

                                            return {
                                                weight: parseInt(p.luggage),
                                                type: "checked",
                                                price: luggagePrice,  // Sử dụng giá tính toán theo logic
                                            };
                                        }),
                                })
                                :
                                confirm.map((flight) => (
                                    postBooking({

                                        userId: localStorage.getItem("userId"),  // Giả định userId là 1
                                        flightId: flight.flightId,
                                        bookingTicketTypes,
                                        passengers: passengers.map(p => ({
                                            firstName: p.firstName,
                                            lastName: p.lastName,
                                            passportNumber: p.passportNumber,
                                            dateOfBirth: p.dateOfBirth,
                                            seatClass: p.seatClass,
                                            luggage: p.luggage ? { weight: p.luggage, type: "checked" } : null,
                                        })),
                                        luggage: passengers
                                            .filter(p => p.luggage && p.luggage !== "0")
                                            .map(p => {
                                                let luggagePrice = 0;

                                                // Tính giá hành lý dựa trên số kg
                                                if (p.luggage === "20") {
                                                    luggagePrice = 300000;
                                                } else if (p.luggage === "30") {
                                                    luggagePrice = 400000;
                                                } else if (p.luggage === "40") {
                                                    luggagePrice = 700000;
                                                } else if (p.luggage === "50") {
                                                    luggagePrice = 1000000;
                                                }
                                                return {
                                                    weight: parseInt(p.luggage),
                                                    type: "checked",
                                                    price: luggagePrice,  // Sử dụng giá tính toán theo logic
                                                };
                                            }),
                                    }
                                    )),
                                )
                        }

                        console.log("Booking success", urlPaymen, "ABC");


                        // window.open(urlPaymen, "_blank");
                    }}>
                        Confirm Booking
                    </button>
                    {/* </Link> */}
                </div>
            </div>
        </div>
    );
};

export default Booking;
