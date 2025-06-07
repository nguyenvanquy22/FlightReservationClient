import React, { useState, useEffect } from 'react';
import './FlightList.scss';
import config from "../config.json";
import * as XLSX from 'xlsx';
import FlightListTable from '../../components/tables/FlightListTable';
import Pagination from '../../components/Pagination/Pagination';
import FlightForm from '../../components/form/FlightForm';
import { fetchWithToken } from '../fetchWithToken';
import Header from '../../components/header/Header';
const { SERVER_API } = config;

const Flightlist = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const flightsPerPage = 5;
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [currentFlight, setCurrentFlight] = useState(null);
    const [airplanes, setAirplanes] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [airports, setAirports] = useState([]);
    const [transitPoints, setTransitPoints] = useState([]);
    const [showTransitPointFields, setShowTransitPointFields] = useState(false);

    const fetchFlights = async () => {
        try {
            const flightRes = await fetchWithToken(`${SERVER_API}/flights`);
            const flightData = await flightRes.json();
            const sortedData = flightData.data.sort((a, b) => b.id - a.id);
            setFlights(sortedData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching flights:', error);
            setLoading(false);
        }
    };
    const fetchAdditionalData = async () => {
        try {
            const [airplaneRes, airlineRes, airportRes] = await Promise.all([
                fetchWithToken(`${SERVER_API}/airplanes`),
                fetchWithToken(`${SERVER_API}/airlines`),
                fetchWithToken(`${SERVER_API}/airports`)
            ]);

            const airplaneData = await airplaneRes.json();
            const airlineData = await airlineRes.json();
            const airportData = await airportRes.json();

            setAirplanes(airplaneData.data);
            setAirlines(airlineData.data);
            setAirports(airportData.data);
        } catch (error) {
            console.error('Error fetching additional data:', error);
        }
    };

    useEffect(() => {
        fetchFlights();
        fetchAdditionalData();
    }, []);

    const handleAddTransitPoint = () => {
        const newStopOrder = transitPoints.length + 1;
        setTransitPoints([
            ...transitPoints,
            {
                airportId: '',
                transitOrder: newStopOrder,
                arrivalTime: '',
                departureTime: ''
            }])


        setShowTransitPointFields(true);
    };


    const handleRemoveTransitPoint = (index) => {
        const newPoints = transitPoints
            .filter((_, idx) => idx !== index)
            .map((point, idx) => ({ ...point, transitOrder: idx + 1 }));

        setTransitPoints(newPoints);
    };

    const handleExportToExcel = () => {
        const sortedFlights = [...flights].sort((a, b) => a.id - b.id);

        const exportData = sortedFlights.map(flight => ({
            "Flight ID": flight.id,
            "Flight Number": flight.flightNumber,
            "Airplane Model": flight.airplane?.model || 'Unknown',
            "Airline Name": flight.airplane.airline?.name || 'Unknown',
            "Departure Airport": flight.originAirport?.name || 'Unknown',
            "Departure City": flight.originAirport?.city || 'Unknown',
            "Departure Country": flight.originAirport?.country || 'Unknown',
            "Departure Time": new Date(flight.departureTime).toLocaleString(),
            "Arrival Airport": flight.destinationAirport?.name || 'Unknown',
            "Arrival City": flight.destinationAirport?.city || 'Unknown',
            "Arrival Country": flight.destinationAirport?.country || 'Unknown',
            "Arrival Time": new Date(flight.arrivalTime).toLocaleString(),
            "Status": flight.status,
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Flights");
        XLSX.writeFile(workbook, "flights_list.xlsx");
    };

    const handleEdit = (flight) => {
        setCurrentFlight(flight);
        setShowForm(true);

        if (flight.transits && flight.transits.length > 0) {
            setTransitPoints(flight.transits);
            setShowTransitPointFields(true);
        } else {
            setTransitPoints([]);
            setShowTransitPointFields(false);
        }
    };

    const handleDelete = async (flightId) => {
        if (window.confirm("Are you sure you want to delete this flight?")) {
            try {
                const response = await fetchWithToken(`${SERVER_API}/flights/${flightId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    alert("Flight deleted successfully");
                    await fetchFlights();
                } else {
                    alert("Failed to delete flight");
                }
            } catch (error) {
                console.error('Error deleting flight:', error);
            }
        }
    };

    const handleAddNew = () => {
        setCurrentFlight(null);
        setShowForm(true);
    };

    const validateFlightData = (flightData) => {
        const errors = {};

        // 1. Flight Number: chỉ uppercase letters + numbers, không rỗng
        if (!/^[A-Z0-9]+$/.test(flightData.flightNumber)) {
            errors.flightNumber = "Flight number must contain only uppercase letters and numbers.";
        }

        // 2. Airports khác nhau
        if (flightData.originAirportId === flightData.destinationAirportId) {
            errors.airports = "Departure and arrival airports must be different.";
        }

        // 3. Times hợp lệ: arrival > departure
        const dep = new Date(flightData.departureTime);
        const arr = new Date(flightData.arrivalTime);
        if (!(arr > dep)) {
            errors.times = "Arrival time must be after departure time.";
        }

        // 4. Transit points: không trùng departure/arrival, unique, và thời gian nội bộ
        const seenAirports = new Set();
        flightData.transits.forEach((t, i) => {
            const at = new Date(t.arrivalTime),
                dt = new Date(t.departureTime);
            if (!(at < dt)) {
                errors[`transit_${i}`] = `Transit #${t.transitOrder}: arrival must be before departure.`;
            }
            if (i === 0 && at <= dep) {
                errors[`transit_${i}`] = `First transit arrival must be after flight departure.`;
            }
            if (i === flightData.transits.length - 1 && dt >= arr) {
                errors[`transit_${i}`] = `Last transit departure must be before flight arrival.`;
            }
            if (seenAirports.has(t.airportId)) {
                errors.transits = "Transit airports must be unique.";
            }
            if (t.airportId === flightData.originAirportId || t.airportId === flightData.destinationAirportId) {
                errors.transits = "Transit airports cannot match departure or arrival airport.";
            }
            seenAirports.add(t.airportId);

            // check next transit order/time
            const next = flightData.transits[i + 1];
            if (next) {
                const nextArr = new Date(next.arrivalTime);
                if (dt >= nextArr) {
                    errors[`transit_${i}`] = `Transit #${t.transitOrder}: departure must be before next transit's arrival.`;
                }
            }
        });

        // 5. Seat configs: phải có ít nhất 1, giá > 0
        if (!Array.isArray(flightData.seatConfigs) || flightData.seatConfigs.length === 0) {
            errors.seatConfigs = "You must configure at least one seat class with a price.";
        } else {
            flightData.seatConfigs.forEach((sc, i) => {
                const price = parseFloat(sc.seatPrice);
                if (isNaN(price) || price <= 0) {
                    errors[`seatConfig_${i}`] = `Seat class "${sc.seatClassName}" price must be a positive number.`;
                }
            });
        }

        if (Object.keys(errors).length) {
            // hiển thị alert hoặc gán setErrorMessage tuỳ UI
            alert(Object.values(errors).join("\n"));
            return false;
        }
        return true;
    };

    const handleSubmitForm = async (flightData) => {
        // 1. Validate
        if (!validateFlightData(flightData)) return;

        try {
            // 2. Chuẩn bị payload đúng tên server kỳ vọng
            const payload = {
                flightNumber: flightData.flightNumber,
                airplaneId: flightData.airplaneId,
                originAirportId: flightData.originAirportId,
                destinationAirportId: flightData.destinationAirportId,
                departureTime: flightData.departureTime,  // '2025-04-01T00:00'
                arrivalTime: flightData.arrivalTime,
                status: flightData.status,
                // map seatConfigs → seatOptions theo DTO server
                seatOptions: flightData.seatConfigs.map(sc => ({
                    seatClassAirplaneId: sc.seatClassAirplaneId,
                    seatPrice: sc.seatPrice
                })),
                transits: flightData.transits.map(t => ({
                    airportId: t.airportId,
                    departureTime: t.departureTime,
                    arrivalTime: t.arrivalTime,
                    transitOrder: t.transitOrder
                }))
            };

            let response;
            if (currentFlight) {
                // Update
                response = await fetchWithToken(`${SERVER_API}/flights/${currentFlight.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } else {
                // Create
                response = await fetchWithToken(`${SERVER_API}/flights`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Server error');
            }

            alert(currentFlight ? "Flight updated successfully!" : "Flight added successfully!");
            // 3. Refresh data & cleanup UI
            await fetchFlights();
            setShowForm(false);
            setShowTransitPointFields(false);
            setTransitPoints([]);
        } catch (err) {
            console.error("Flight submit error:", err);
            alert(err.message || "An error occurred. Please try again.");
        }
    };

    const filteredFlights = flights.filter((flight) =>
        flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastFlight = currentPage * flightsPerPage;
    const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
    const currentFlights = filteredFlights.slice(indexOfFirstFlight, indexOfLastFlight);
    const totalPages = Math.ceil(filteredFlights.length / flightsPerPage);

    if (loading) {
        return <div>Loading flights...</div>;
    }

    return (
        <div className="container">
            <Header title={'Flights'} />
            <div className="flight-list-container content">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search flights by flight number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className='btns'>
                    <button className="add-flight-button" onClick={handleAddNew}>
                        Add Flight
                    </button>

                    <button className="export-flights-button" onClick={handleExportToExcel}>
                        Export to Excel
                    </button>
                </div>
                {showForm && (
                    <FlightForm
                        currentFlight={currentFlight}
                        airplanes={airplanes}
                        airlines={airlines}
                        airports={airports}
                        transitPoints={transitPoints}
                        setTransitPoints={setTransitPoints}
                        showTransitPointFields={showTransitPointFields}
                        handleAddTransitPoint={handleAddTransitPoint}
                        handleRemoveTransitPoint={handleRemoveTransitPoint}
                        handleSubmitForm={handleSubmitForm}
                        setShowForm={setShowForm}
                    />
                )}

                <FlightListTable
                    currentFlights={currentFlights}
                    airports={airports}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />

            </div>
        </div>
    );
};

export default Flightlist;