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
    const [allFlights, setallFlights] = useState([]);

    const fetchFlights = async () => {
        try {
            const flightRes = await fetchWithToken(`${SERVER_API}/flights`);
            const flightData = await flightRes.json();
            const sortedData = flightData.data.sort((a, b) => b.flightId - a.flightId);
            setallFlights(flightData);
            setFlights(sortedData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching flights:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlights();
    }, []);

    useEffect(() => {
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

        fetchAdditionalData();

        const intervalId = setInterval(() => {
            fetchAdditionalData();
        }, 30000);

        return () => clearInterval(intervalId);
    }, []);

    const handleAddTransitPoint = () => {
        const newStopOrder = transitPoints.length + 1;
        setTransitPoints([
            ...transitPoints,
            {
                airport: {
                    airportId: '',
                    airportCode: '',
                    airportName: '',
                    city: '',
                    country: '',

                },
                stopOrder: newStopOrder,
                arrivalTime: '',
                departureTime: ''
            }])



        setShowTransitPointFields(true);
    };


    const handleRemoveTransitPoint = (index) => {
        const newPoints = transitPoints
            .filter((_, idx) => idx !== index)
            .map((point, idx) => ({ ...point, stopOrder: idx + 1 }));

        setTransitPoints(newPoints);
    };

    const handleExportToExcel = () => {
        const sortedFlights = [...flights].sort((a, b) => a.flightId - b.flightId);

        const exportData = sortedFlights.map(flight => ({
            "Flight ID": flight.flightId,
            "Flight Number": flight.flightNumber,
            "Airplane Model": flight.airplane?.model || 'Unknown',
            "Total Seats": flight.airplane?.totalSeats || 'Unknown',
            "Airline Name": flight.airline?.name || 'Unknown',
            "Airline Code": flight.airline?.code || 'Unknown',
            "Departure Airport": flight.departureAirport?.airportName || 'Unknown',
            "Departure City": flight.departureAirport?.city || 'Unknown',
            "Departure Country": flight.departureAirport?.country || 'Unknown',
            "Departure Time": new Date(flight.departureTime).toLocaleString(),
            "Arrival Airport": flight.arrivalAirport?.airportName || 'Unknown',
            "Arrival City": flight.arrivalAirport?.city || 'Unknown',
            "Arrival Country": flight.arrivalAirport?.country || 'Unknown',
            "Arrival Time": new Date(flight.arrivalTime).toLocaleString(),
            "Base Price": flight.basePrice,
            "Status": flight.status,
            "Transit Points": flight.transitPointList.map(point =>
                `${point.airport.airportName} (${point.airport.city}, ${point.airport.country}) - Arrival: ${new Date(point.arrivalTime).toLocaleString()} - Departure: ${new Date(point.departureTime).toLocaleString()}`
            ).join('; ')
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Flights");
        XLSX.writeFile(workbook, "flight_list.xlsx");
    };

    const handleEdit = (flight) => {
        setCurrentFlight(flight);
        setShowForm(true);

        if (flight.transitPointList && flight.transitPointList.length > 0) {
            setTransitPoints(flight.transitPointList);
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
                    setFlights(flights.filter(flight => flight.flightId !== flightId));
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
        const flightNumberPattern = /^[A-Z0-9]+$/;
        if (!flightNumberPattern.test(flightData.flightNumber)) {
            errors.flightNumber = "Flight number must contain uppercase letters and numbers.";
        }

        if (flightData.departureAirportId === flightData.arrivalAirportId) {
            errors.airports = "Departure and arrival airports must be different.";
        }

        const transitAirports = flightData.transitPointList.map(point => point.airportId);
        const hasDuplicateTransitAirport = transitAirports.some(airport =>
            airport === flightData.departureAirportId || airport === flightData.arrivalAirportId);
        if (hasDuplicateTransitAirport) {
            errors.transitPoints = "Transit airports cannot be the same as departure or arrival airports.";
        }

        const uniqueTransitAirports = new Set(transitAirports);
        if (uniqueTransitAirports.size !== transitAirports.length) {
            errors.transitPointsUnique = "Transit airports must be unique.";
        }

        if (new Date(flightData.arrivalTime) <= new Date(flightData.departureTime)) {
            errors.time = "Arrival time must be after departure time.";
        }

        flightData.transitPointList.forEach((transit, index) => {
            const nextTransit = flightData.transitPointList[index + 1];

            // Kiểm tra thời gian của điểm dừng hiện tại
            if (new Date(transit.arrivalTime) >= new Date(transit.departureTime)) {
                errors.transitTimes = `Arrival time of transit ${transit.stopOrder} must be before departure time.`;
            }

            // Kiểm tra thời gian giữa điểm dừng hiện tại và điểm dừng kế tiếp
            if (nextTransit) {
                if (new Date(transit.departureTime) >= new Date(nextTransit.arrivalTime)) {
                    errors.transitTimes = `Departure time of transit ${transit.stopOrder} must be before arrival time of transit ${nextTransit.stopOrder}.`;
                }
            }

            // Kiểm tra ràng buộc với thời gian chuyến bay chính
            if (index === 0 && new Date(transit.arrivalTime) <= new Date(flightData.departureTime)) {
                errors.transitTimes = `Arrival time of the first transit point (${transit.stopOrder}) must be after the flight's departure time.`;
            }
            if (index === flightData.transitPointList.length - 1 && new Date(transit.departureTime) >= new Date(flightData.arrivalTime)) {
                errors.transitTimes = `Departure time of the last transit point (${transit.stopOrder}) must be before the flight's arrival time.`;
            }
        });


        if (isNaN(flightData.basePrice) || flightData.basePrice <= 0) {
            errors.price = "Price must be a positive number.";
        }

        if (Object.keys(errors).length > 0) {
            alert(Object.values(errors).join("\n"));
            return false;
        }

        return true;
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();

        // Chuyển đổi giờ và phút từ local time sang UTC bằng cách cộng thêm giờ
        const convertToUTC = (localTime) => {
            const date = new Date(localTime);
            date.setHours(date.getHours() + 14);
            return date.toISOString();
        };

        const convertToUTC2 = (localTime) => {
            const date = new Date(localTime);
            date.setHours(date.getHours() + 14);
            return date.toISOString();
        };


        const formData = new FormData(e.target);
        const flightData = {
            flightNumber: formData.get("flightNumber"),
            airplaneId: parseInt(formData.get("airplaneId")),
            airlineId: parseInt(formData.get("airlineId")),
            departureAirportId: parseInt(formData.get("departureAirportId")),
            arrivalAirportId: parseInt(formData.get("arrivalAirportId")),
            departureTime: convertToUTC(formData.get("departureTime")),
            arrivalTime: convertToUTC(formData.get("arrivalTime")),
            basePrice: parseFloat(formData.get("basePrice")),
            status: formData.get("status"),
            transitPointList: transitPoints.map((point) => ({
                stopOrder: parseInt(point.stopOrder),
                airportId: parseInt(point.airport.airportId),
                arrivalTime: point.arrivalTime,
                departureTime: point.departureTime,
            })),
        };

        const isValid = validateFlightData(flightData);
        if (!isValid) {
            return;
        }

        try {
            if (currentFlight) {
                const isDataChanged = (currentFlight, flightData) => {

                    const parseDate = (dateStr) => {
                        const date = new Date(dateStr);
                        return date.toISOString().slice(0, 19);
                    };
                    let checkdataflight = false;

                    if (
                        currentFlight.flightNumber !== flightData.flightNumber ||
                        currentFlight.airplane?.airplaneId !== flightData.airplaneId ||
                        currentFlight.airline?.airlineId !== flightData.airlineId ||
                        currentFlight.departureAirport?.airportId !== flightData.departureAirportId ||
                        currentFlight.arrivalAirport?.airportId !== flightData.arrivalAirportId ||
                        currentFlight.departureTime !== parseDate(flightData.departureTime) ||
                        currentFlight.arrivalTime !== parseDate(flightData.arrivalTime) ||
                        currentFlight.basePrice !== flightData.basePrice ||
                        currentFlight.status !== flightData.status
                    ) {
                        checkdataflight = true;
                    }

                    // Check if transit points have changed
                    const checkdataflighttransitpoint = currentFlight.transitPointList.length !== flightData.transitPointList.length ||
                        currentFlight.transitPointList.some((currentPoint, index) => {
                            const newPoint = flightData.transitPointList[index];
                            return (
                                currentPoint.stopOrder !== newPoint?.stopOrder ||
                                currentPoint?.airport?.airportId !== newPoint?.airportId ||
                                parseDate(currentPoint.arrivalTime) !== parseDate(newPoint?.arrivalTime) ||
                                parseDate(currentPoint.departureTime) !== parseDate(newPoint?.departureTime)
                            );
                        });

                    // Kiểm tra xem có sự thay đổi về transit point hay không
                    let areTransitPointsChanged = checkdataflight || checkdataflighttransitpoint;
                    return areTransitPointsChanged;
                };

                // Check if the data has changed
                // console.log(currentFlight)
                // console.log(flightData)
                if (currentFlight && !isDataChanged(currentFlight, flightData)) {
                    alert("No changes detected. Data was not updated.");
                    return;
                }

                const flightRes = await fetchWithToken(`${SERVER_API}/flights/all`);
                const flights = await flightRes.json();
                const existingFlight = flights.find(flight => flight.flightId === currentFlight.flightId);

                if (existingFlight && existingFlight.transitPointList.length > 0) {
                    const deletePromises = existingFlight.transitPointList.map(async (transit) => {
                        await fetchWithToken(`${SERVER_API}/transitpoints/delete/${transit.transitId}`, {
                            method: "DELETE",
                        });
                    });
                    await Promise.all(deletePromises);
                }

                const putResponse = await fetchWithToken(`${SERVER_API}/flights/${currentFlight.flightId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(flightData),
                });

                if (!putResponse.ok) throw new Error("Error Updated.");
                alert("Flight updated successfully!");
            } else {
                const allFlightdata = allFlights;
                const flightExists = allFlightdata.some(flight => flight.flightNumber === flightData.flightNumber);
                if (flightExists) {
                    alert("Flight number already exists.")
                }

                const postResponse = await fetchWithToken(`${SERVER_API}/flights/add`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(flightData),
                });

                if (!postResponse.ok) throw new Error("Error Add Flight.");
                alert("Add Flight successful!");
            }

            const updatedFlights = await (await fetchWithToken(`${SERVER_API}/flights/all`)).json();
            const sortedFlights = updatedFlights.sort((a, b) => b.flightId - a.flightId);
            setFlights(sortedFlights);
            setShowForm(false);
            setShowTransitPointFields(false);
            setTransitPoints([]);
        } catch (error) {
            console.error("Lỗi xử lý handleSubmitForm:", error);
            alert("ERROR Please Try Again!");
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
                    flights={flights}
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