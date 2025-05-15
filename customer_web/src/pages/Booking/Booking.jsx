import React, { useContext } from "react";
import "./Booking.scss";
import { StoreContext } from "../../context/StoreContext";

const Booking = () => {
    const {
        selectedDepartureFlight,
        selectedSeatOption,
        isRoundTrip,
        selectedReturnFlight,
        returnSeatOption,
        adults,
        passengerDetails,
        updatePassengerDetail,
        submitBooking,
        urlPayment,
        formatTime,
        formatDate,
        calculateTotalPrice,
        formatPrice,
    } = useContext(StoreContext);

    // Nếu chưa có dữ liệu, nhắc người dùng quay lại Confirm
    if (!selectedDepartureFlight || !selectedSeatOption) {
        return <p>Please complete the flight selection first.</p>;
    }

    // Các chuyến cần render
    const flightsToBook = isRoundTrip
        ? [selectedDepartureFlight, selectedReturnFlight]
        : [selectedDepartureFlight];
    const seatOptions = isRoundTrip
        ? [selectedSeatOption, returnSeatOption]
        : [selectedSeatOption];

    // Submit và xử lý redirect
    const handleConfirm = async () => {
        const result = await submitBooking();
        if (result?.paymentUrl) {
            window.open(result.paymentUrl, "_blank");
        }
        // có thể điều hướng sang trang chi tiết booking nếu muốn:
        // navigate(`/booking/summary/${result.id}`);
    };

    return (
        <div className="booking-page">
            <div className="contain">
                {/* Hiển thị info từng chuyến */}
                {flightsToBook.map((flight, idx) => (
                    <div key={flight.id} className={isRoundTrip ? "depart-round_trip" : "depart"}>
                        <h2>
                            {flight.originAirport.city} ({flight.originAirport.country}) -{" "}
                            {flight.destinationAirport.city} ({flight.destinationAirport.country})
                        </h2>
                        <p>
                            {formatTime(flight.departureTime)} - {formatDate(flight.departureTime)} |{" "}
                            {formatTime(flight.arrivalTime)} - {formatDate(flight.arrivalTime)} |{" "}
                            {flight.transits && flight.transits.length > 0
                                ? `${flight.transits.length} transit(s)`
                                : "Direct"}
                        </p>
                        <p className="price">
                            {formatPrice(seatOptions[idx].seatPrice)} VND / pax
                        </p>
                    </div>
                ))}

                {/* Form nhập thông tin hành khách */}
                <div className="passenger-details">
                    {passengerDetails.map((p, i) => {
                        const flightBase = selectedDepartureFlight.basePrice;
                        // Giá mỗi pax trên cả hành trình, đã tính discount nếu có
                        const perPax = calculateTotalPrice() / adults;
                        return (
                            <div key={i} className="form-info">
                                <h3>Passenger {i + 1}</h3>
                                <div className="input-info">
                                    <div>
                                        <label>First Name</label>
                                        <input
                                            name="firstName"
                                            value={p.firstName}
                                            onChange={e => updatePassengerDetail(i, "firstName", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label>Last Name</label>
                                        <input
                                            name="lastName"
                                            value={p.lastName}
                                            onChange={e => updatePassengerDetail(i, "lastName", e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="input-info">
                                    <div>
                                        <label>Passport Number</label>
                                        <input
                                            name="passportNumber"
                                            value={p.passportNumber}
                                            onChange={e => updatePassengerDetail(i, "passportNumber", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label>Date of Birth</label>
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={p.dateOfBirth}
                                            onChange={e => updatePassengerDetail(i, "dateOfBirth", e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="input-info-seat-class">
                                    <label>Class</label>
                                    <select
                                        name="seatClass"
                                        value={p.seatClass}
                                        onChange={e => updatePassengerDetail(i, "seatClass", e.target.value)}
                                        className="seat-class"
                                    >
                                        <option value="ECONOMY">Economy</option>
                                        <option value="BUSINESS">Business</option>
                                        <option value="FIRST">First</option>
                                    </select>

                                    <label>Luggage</label>
                                    <select
                                        name="luggage"
                                        value={p.luggage}
                                        onChange={e => updatePassengerDetail(i, "luggage", e.target.value)}
                                        className="seat-class"
                                    >
                                        <option value="0">No luggage</option>
                                        <option value="20">20kg</option>
                                        <option value="30">30kg</option>
                                        <option value="40">40kg</option>
                                        <option value="50">50kg</option>
                                    </select>

                                    <p className="base-price">
                                        {formatPrice(perPax)} VND
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Submit block */}
            <div className="submit">
                <h3>Total Price</h3>
                <p>(for {adults} pax)</p>
                <h3 className="total-price">
                    {formatPrice(calculateTotalPrice())} VND
                </h3>
                <button className="booking" onClick={handleConfirm}>
                    Confirm Booking
                </button>
            </div>
        </div>
    );
};

export default Booking;
