import React, { useEffect, useState } from "react";
import "./styles/FlightForm.scss";
import Select from 'react-select';
import { fetchWithToken } from '../../views/fetchWithToken';
import config from '../../views/config.json';

const { SERVER_API } = config;

const FlightForm = ({
    currentFlight,
    airplanes,
    airports,
    showTransitPointFields,
    transitPoints,
    setTransitPoints,
    handleAddTransitPoint,
    handleRemoveTransitPoint,
    handleSubmitForm,
    setShowForm,
    errorMessage,
}) => {
    // seat pricing config for selected airplane
    const [seatConfigs, setSeatConfigs] = useState([]);

    // Load existing seatConfigs when editing
    useEffect(() => {
        if (currentFlight) {
            loadSeatConfigs(currentFlight.airplane.id);
        }
        // eslint-disable-next-line
    }, [currentFlight]);

    // Fetch airplane details to get seat classes
    const loadSeatConfigs = async (airplaneId) => {
        if (!airplaneId) return;
        if (currentFlight && currentFlight.airplane.id === airplaneId) {
            setSeatConfigs(currentFlight.seatOptions);
            return;
        }
        try {
            const res = await fetchWithToken(`${SERVER_API}/airplanes/${airplaneId}`);
            const json = await res.json();
            const scs = json.data.seatClassAirplanes || [];

            const init = scs.map(sc => (
                {
                    seatClassAirplaneId: sc.id,
                    seatClassName: sc.seatClassName,
                    seatPrice: ""
                }
            ));
            setSeatConfigs(init);
        } catch (err) {
            console.error("Error loading seat configs:", err);
        }
    };

    const handleAirplaneChange = e => {
        const airplaneId = parseInt(e.target.value, 10);
        loadSeatConfigs(airplaneId);
    };

    const handlePriceChange = (idx, val) => {
        setSeatConfigs(prev => {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], price: val };
            return copy;
        });
    };

    const onSubmit = e => {
        e.preventDefault();
        const f = e.target;
        const payload = {
            flightNumber: f.flightNumber.value,
            airplaneId: parseInt(f.airplaneId.value, 10),
            originAirportId: parseInt(f.departureAirportId.value, 10),
            destinationAirportId: parseInt(f.arrivalAirportId.value, 10),
            departureTime: f.departureTime.value,
            arrivalTime: f.arrivalTime.value,
            status: f.status.value,
            seatClassAirplaneFlights: seatConfigs
                .filter(sc => sc.price)
                .map(sc => ({
                    seatClassAirplaneId: sc.seatClassAirplaneId,
                    seatPrice: parseFloat(sc.price)
                })),
            transits: transitPoints
        };
        handleSubmitForm(payload);
    };

    return (
        <div className="flightform-modal">
            <div className="modal-content">
                <div className="flight-form">
                    <h3>{currentFlight ? "Edit Flight" : "Add Flight"}</h3>
                    <form onSubmit={onSubmit} className="flightform-grid">
                        {/* --- Basic Info (Left Column) --- */}
                        <div className="basic-info">
                            <label>
                                Flight Number
                                <input
                                    name="flightNumber"
                                    type="text"
                                    defaultValue={currentFlight?.flightNumber || ""}
                                    required
                                />
                                {errorMessage?.flightNumber && <span className="error">{errorMessage.flightNumber}</span>}
                            </label>

                            <label>
                                Airplane
                                <select
                                    name="airplaneId"
                                    defaultValue={currentFlight?.airplane.id || ""}
                                    onChange={handleAirplaneChange}
                                    required
                                >
                                    <option value="" disabled>Select Airplane</option>
                                    {airplanes.map(a => (
                                        <option key={a.id} value={a.id}>{a.model}</option>
                                    ))}
                                </select>
                                {errorMessage?.airplaneId && <span className="error">{errorMessage.airplaneId}</span>}
                            </label>

                            <label>
                                Departure Airport
                                <select name="departureAirportId"
                                    defaultValue={currentFlight?.originAirport.id || ""}
                                    required>
                                    <option value="" disabled>Select Departure</option>
                                    {airports.map(ap => (
                                        <option key={ap.id} value={ap.id}>{ap.name}</option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Arrival Airport
                                <select name="arrivalAirportId"
                                    defaultValue={currentFlight?.destinationAirport.id || ""}
                                    required>
                                    <option value="" disabled>Select Arrival</option>
                                    {airports.map(ap => (
                                        <option key={ap.id} value={ap.id}>{ap.name}</option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Departure Time
                                <input
                                    name="departureTime"
                                    type="datetime-local"
                                    defaultValue={
                                        currentFlight
                                            ? new Date(currentFlight.departureTime)
                                                .toISOString().slice(0, 16)
                                            : ""
                                    }
                                    required
                                />
                            </label>

                            <label>
                                Arrival Time
                                <input
                                    name="arrivalTime"
                                    type="datetime-local"
                                    defaultValue={
                                        currentFlight
                                            ? new Date(currentFlight.arrivalTime)
                                                .toISOString().slice(0, 16)
                                            : ""
                                    }
                                    required
                                />
                            </label>

                            <label>
                                Status
                                <select name="status" defaultValue={currentFlight?.status || "SCHEDULED"} required>
                                    {["SCHEDULED", "DELAYED", "CANCELLED", "DEPARTED", "ARRIVED"].map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        {/* --- Right Column: Seat Pricing + Transit --- */}
                        <div className="right-pane">
                            <div className="seat-pricing">
                                <h4>Seat Class Pricing</h4>
                                <div className="seat-pricing-list">
                                    {/* {currentFlight?.seatOptions ? () } */}
                                    {seatConfigs.map((sc, idx) => (
                                        <div key={sc.seatClassAirplaneId} className="seat-pricing-item">
                                            <span>{sc.seatClassName} Class:</span>
                                            <input
                                                type="number"
                                                placeholder="Price"
                                                value={sc.seatPrice}
                                                onChange={e => handlePriceChange(idx, e.target.value)}
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="transit-section">
                            <h4>Transit Points</h4>
                            {showTransitPointFields && (
                                <div className="transits-list">
                                    {transitPoints.map((point, i) => (
                                        <div key={i} className="transit-point">
                                            <h5>Stop #{point.transitOrder}</h5>

                                            <label>
                                                Airport Stop
                                                <select
                                                    value={point.airportId || ""}
                                                    onChange={e => {
                                                        const sel = airports.find(ap => ap.id === +e.target.value);
                                                        if (!sel) return;
                                                        const arr = [...transitPoints];
                                                        arr[i] = {
                                                            ...arr[i],
                                                            airportId: sel.id,
                                                        };
                                                        setTransitPoints(arr);
                                                    }}
                                                >
                                                    <option value="" disabled>Select Airport</option>
                                                    {airports.map(ap => (
                                                        <option key={ap.id} value={ap.id}>{ap.name}</option>
                                                    ))}
                                                </select>
                                            </label>

                                            <label>
                                                Arrival Time
                                                <input
                                                    type="datetime-local"
                                                    value={point.arrivalTime || ""}
                                                    onChange={e => {
                                                        const arr = [...transitPoints];
                                                        arr[i].arrivalTime = e.target.value;
                                                        setTransitPoints(arr);
                                                    }}
                                                />
                                            </label>

                                            <label>
                                                Departure Time
                                                <input
                                                    type="datetime-local"
                                                    value={point.departureTime || ""}
                                                    onChange={e => {
                                                        const arr = [...transitPoints];
                                                        arr[i].departureTime = e.target.value;
                                                        setTransitPoints(arr);
                                                    }}
                                                />
                                            </label>

                                            <button
                                                type="button"
                                                className="button-remove-transitpoint"
                                                onClick={() => handleRemoveTransitPoint(i)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <button
                                type="button"
                                className="button-add-transitpoint"
                                onClick={handleAddTransitPoint}
                            >
                                Add Transit Point
                            </button>
                        </div>

                        {/* --- Buttons --- */}
                        <div className="form-buttons">
                            <button
                                type="button"
                                className="button-cancel"
                                onClick={() => {
                                    setShowForm(false);
                                    setTransitPoints([]);
                                }}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="button-submit">
                                {currentFlight ? "Save Changes" : "Add Flight"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FlightForm;
