import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './AirportList.scss';
import config from "../config.json";
import Pagination from '../../components/Pagination/Pagination';
import AirportForm from '../../components/form/AirportForm';
import AirportTable from '../../components/tables/AirportTable';
import { fetchWithToken } from '../fetchWithToken';
import Header from '../../components/header/Header';
import Loading from '../../components/loading/Loading';

const { SERVER_API } = config;

const AirportList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const airportsPerPage = 5;
    const [airports, setAirports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [currentAirport, setCurrentAirport] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    // Fetch all airports data
    const fetchAirports = async () => {
        setLoading(true);
        try {
            const response = await fetchWithToken(`${SERVER_API}/airports`);
            const data = await response.json();

            setAirports(data.data.sort((a, b) => b.id - a.id));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching airports:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAirports();
    }, []);

    const handleEdit = (airport) => {
        setCurrentAirport(airport);
        setShowForm(true);
    };

    const handleDelete = async (airportId) => {
        if (window.confirm("Are you sure you want to delete this airport?")) {
            try {
                const response = await fetchWithToken(`${SERVER_API}/airports/${airportId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    alert("Airport deleted successfully");
                    setAirports(airports.filter(airport => airport.id !== airportId));
                } else {
                    alert("Failed to delete airport");
                }
            } catch (error) {
                console.error('Error deleting airport:', error);
            }
        }
    };

    const handleAddNew = () => {
        setCurrentAirport(null);
        setShowForm(true);
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const airportData = {
            iataCode: formData.get('iataCode').trim(),
            icaoCode: formData.get('icaoCode').trim(),
            name: formData.get('name').trim(),
            city: formData.get('city').trim(),
            country: formData.get('country').trim(),
            address: formData.get('address').trim(),
        };
        const errors = {};

        if (!airportData.iataCode) {
            errors.iataCode = "IATA Code is required.";
        } else if (!/^[A-Z0-9]{3}$/.test(airportData.iataCode)) {
            errors.iataCode = "Airport IATA Code must be 3 uppercase letters (no spaces , no special character).";
        }
        if (!airportData.icaoCode) {
            errors.icaoCode = "ICAO Code is required.";
        } else if (!/^[A-Z0-9]{4}$/.test(airportData.icaoCode)) {
            errors.icaoCode = "Airport ICAO Code must be 4 uppercase letters (no spaces , no special character).";
        }

        if (!airportData.name) {
            errors.name = "Name is required.";
        } else if (airportData.name.length > 50) {
            errors.name = "Name must not exceed 50 characters.";
        } else if (airportData.name.length < 3) {
            errors.name = "Name must be lager 3 characters.";
        } else if (!/^[A-Za-z\s]+$/.test(airportData.name)) {
            errors.name = "Name must contain only letters and spaces.";
        }

        if (!airportData.city) {
            errors.city = "City is required.";
        } else if (airportData.city.length > 50) {
            errors.city = "City must not exceed 50 characters.";
        } else if (airportData.city.length < 3) {
            errors.city = "City must be lager 3 characters.";
        } else if (!/^[A-Za-z\s]+$/.test(airportData.city)) {
            errors.city = "City must contain only letters and spaces.";
        }

        if (!airportData.country) {
            errors.country = "Country is required.";
        } else if (airportData.country.length > 50) {
            errors.country = "Country must not exceed 50 characters.";
        } else if (airportData.country.length < 3) {
            errors.country = "Country must be lager 3 characters.";
        } else if (!/^[A-Za-z\s]+$/.test(airportData.country)) {
            errors.country = "Country must contain only letters and spaces.";
        }

        console.log(airportData)

        if (!airportData.address) {
            errors.address = "Address is required.";
        } else if (airportData.address.length > 50) {
            errors.address = "Address must not exceed 50 characters.";
        } else if (airportData.address.length < 3) {
            errors.address = "Address must be lager 3 characters.";
        } else if (!/^[A-Za-z\s]+$/.test(airportData.address)) {
            errors.address = "Address must contain only letters and spaces.";
        }

        if (currentAirport) {
            const hasChanges =
                airportData.iataCode !== currentAirport.iataCode ||
                airportData.icaoCode !== currentAirport.icaoCode ||
                airportData.name !== currentAirport.name ||
                airportData.city !== currentAirport.city ||
                airportData.country !== currentAirport.country ||
                airportData.address !== currentAirport.addess;

            if (!hasChanges) {
                alert("No changes detected. Please make changes before submitting..");
                return;
            }
        }

        if (Object.keys(errors).length > 0) {
            setErrorMessage(errors);
            return;
        }

        try {
            let response;
            if (currentAirport) {
                response = await fetchWithToken(`${SERVER_API}/airports/${currentAirport.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(airportData),
                });
            } else {
                response = await fetchWithToken(`${SERVER_API}/airports`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(airportData),
                });
            }

            if (response.ok) {
                alert(currentAirport ? "Airport updated successfully!" : "Airport added successfully!");
                setShowForm(false);
                setErrorMessage([]);
                fetchAirports();
            } else {
                console.log("Error submitting airport data.");
            }
        } catch (error) {
            console.error("Error submitting airport data:", error);
        }
    };

    const exportToExcel = () => {

        setAirports(airports.sort((a, b) => a.id - b.id))
        const worksheet = XLSX.utils.json_to_sheet(airports);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Airports");
        XLSX.writeFile(workbook, "Airports_List.xlsx");
    };

    const filteredAirports = airports.filter((airport) =>
        airport.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastAirport = currentPage * airportsPerPage;
    const indexOfFirstAirport = indexOfLastAirport - airportsPerPage;
    const currentAirports = filteredAirports.slice(indexOfFirstAirport, indexOfLastAirport);
    const totalPages = Math.ceil(filteredAirports.length / airportsPerPage);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="container">
            <Header title={'Airports'} />
            <div className="airport-list-container content">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search airports by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="btns">
                    <button className="add-airport-button" onClick={handleAddNew}>
                        Add Airport
                    </button>

                    <button className="export-airport-button" onClick={exportToExcel}>
                        Export to Excel
                    </button>
                </div>

                {showForm && (
                    <AirportForm
                        currentAirport={currentAirport}
                        onSubmit={handleSubmitForm}
                        onCancel={() => setShowForm(false)}
                        errorMessage={errorMessage}
                    />
                )}
                <AirportTable
                    airports={currentAirports}
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

export default AirportList;
