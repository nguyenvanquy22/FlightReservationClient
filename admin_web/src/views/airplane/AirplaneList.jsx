import React, { useState, useEffect } from 'react';
import './AirplaneList.scss';
import config from "../config.json";
import * as XLSX from 'xlsx';
import AirplaneForm from "../../components/form/AirplaneForm";
import AirplaneTable from '../../components/tables/AirplaneTable';
import Pagination from '../../components/Pagination/Pagination';
import { fetchWithToken } from '../fetchWithToken';
import Header from '../../components/header/Header';

const { SERVER_API } = config;

const AirplaneList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const airplanesPerPage = 5;
    const [airplanes, setAirplanes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [currentAirplane, setCurrentAirplane] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchAirplanes = async () => {
        try {
            const response = await fetchWithToken(`${SERVER_API}/airplanes`);
            const data = await response.json();
            setAirplanes(data.data.sort((a, b) => b.id - a.id));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching airplanes:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAirplanes();
    }, []);

    const handleEdit = (airplane) => {
        setCurrentAirplane(airplane);
        setShowForm(true);
    };

    const handleDelete = async (airplaneId) => {
        if (window.confirm("Are you sure you want to delete this airplane?")) {
            try {
                const response = await fetchWithToken(`${SERVER_API}/airplanes/${airplaneId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    alert("Airplane deleted successfully");
                    setAirplanes(airplanes.filter(airplane => airplane.id !== airplaneId));
                } else {
                    alert("Failed to delete airplane");
                }
            } catch (error) {
                console.error('Error deleting airplane:', error);
            }
        }
    };

    const handleAddNew = () => {
        setCurrentAirplane(null);
        setShowForm(true);
        setErrorMessage("");
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const airplaneData = {
            model: formData.get('model')?.trim(),
            totalSeat: parseInt(formData.get('totalSeat'), 10),
        };

        const errors = {};

        // Validation
        if (!airplaneData.model) {
            errors.model = "Model name is required.";
        } else if (!/^[a-zA-Z0-9\s\-]+$/.test(airplaneData.model)) {
            errors.model = "Model name must only contain letters, numbers, spaces, and dashes.";
        } else if (airplaneData.model.length < 3 || airplaneData.model.length > 50) {
            errors.model = "Model name must be between 3 and 50 characters.";
        }

        if (!airplaneData.totalSeat || isNaN(airplaneData.totalSeat)) {
            errors.totalSeat = "Total seats must be a valid number.";
        } else if (!Number.isInteger(airplaneData.totalSeat)) {
            errors.totalSeat = "Total seats must be an integer.";
        } else if (airplaneData.totalSeat <= 0) {
            errors.totalSeat = "Total seats must be greater than 0.";
        } else if (airplaneData.totalSeat > 2000) {
            errors.totalSeat = "Total seats must not exceed 2000.";
        }

        const duplicateAirplane = airplanes.find(
            airplane => airplane.model.toLowerCase() === airplaneData.model.toLowerCase() &&
                airplane.id !== currentAirplane?.id
        );
        if (duplicateAirplane) {
            errors.model = "An airplane with this model already exists.";
        }

        if (Object.keys(errors).length > 0) {
            setErrorMessage(errors);
            return;
        }

        try {
            let response;
            if (currentAirplane) {

                if (
                    currentAirplane &&
                    currentAirplane.model === airplaneData.model &&
                    currentAirplane.totalSeat === airplaneData.totalSeat
                ) {
                    alert("No changes detected. Please make changes before submitting.");
                    return;
                }

                response = await fetchWithToken(`${SERVER_API}/airplanes/${currentAirplane.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(airplaneData),
                });
            } else {
                response = await fetchWithToken(`${SERVER_API}/airplanes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(airplaneData),
                });
            }

            if (response.ok) {
                alert(currentAirplane ? "Airplane updated successfully" : "Airplane added successfully");
                setShowForm(false);
                setErrorMessage([]);
                fetchAirplanes();
            } else {
                const errorResponse = await response.json();
                alert(`Failed to submit airplane data: ${errorResponse.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error submitting airplane data:', error);
            alert('An error occurred while submitting airplane data. Please try again.');
        }
    };
    const exportToExcel = () => {
        setAirplanes(airplanes.sort((a, b) => a.id - b.id))
        const worksheet = XLSX.utils.json_to_sheet(airplanes);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Airplanes");
        XLSX.writeFile(workbook, "Airplanes_List.xlsx");
    };

    const filteredAirplanes = airplanes.filter((airplane) =>
        airplane.model.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastAirplane = currentPage * airplanesPerPage;
    const indexOfFirstAirplane = indexOfLastAirplane - airplanesPerPage;
    const currentAirplanes = filteredAirplanes.slice(indexOfFirstAirplane, indexOfLastAirplane);
    const totalPages = Math.ceil(filteredAirplanes.length / airplanesPerPage);

    if (loading) {
        return <div>Loading airplanes...</div>;
    }

    return (
        <div className='container'>
            <Header title={'Airplanes'} />
            <div className="airplane-list-container content">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search airplanes by model..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className='btns'>
                    <button className="add-airplane-button" onClick={handleAddNew}>
                        Add Airplane
                    </button>
                    <button className="export-airplane-button" onClick={exportToExcel}>
                        Export to Excel
                    </button>
                </div>
                {showForm && (
                    <div className="airplanes-modal">
                        <div className="modal-content">
                            <AirplaneForm
                                currentAirplane={currentAirplane}
                                onSubmit={handleSubmitForm}
                                onCancel={() => setShowForm(false)}
                                errorMessage={errorMessage}
                            />
                        </div>
                    </div>
                )}

                <AirplaneTable
                    currentAirplanes={currentAirplanes}
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

export default AirplaneList;
