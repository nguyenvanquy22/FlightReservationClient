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

    const handleSubmitForm = async (formData) => {

        const errors = {};

        // 1. Validate model
        if (!formData.model || !formData.model.trim()) {
            errors.model = "Model name is required.";
        } else if (!/^[a-zA-Z0-9\s\-]+$/.test(formData.model)) {
            errors.model = "Model name must only contain letters, numbers, spaces, and dashes.";
        } else if (formData.model.length < 3 || formData.model.length > 50) {
            errors.model = "Model name must be between 3 and 50 characters.";
        }

        // 2. Validate registrationCode
        if (!formData.registrationCode || !formData.registrationCode.trim()) {
            errors.registrationCode = "Registration code is required.";
        } else if (!/^[A-Z0-9\-]+$/.test(formData.registrationCode)) {
            errors.registrationCode = "Registration code must be uppercase letters, numbers or dashes.";
        } else if (formData.registrationCode.length < 3 || formData.registrationCode.length > 20) {
            errors.registrationCode = "Registration code must be between 3 and 20 characters.";
        }

        // 3. Validate airlineId
        if (!formData.airlineId || isNaN(formData.airlineId)) {
            errors.airlineId = "An airline must be selected.";
        }

        // 4. Validate status
        if (!["ACTIVE", "MAINTENANCE"].includes(formData.status)) {
            errors.status = "Status must be either ACTIVE or MAINTENANCE.";
        }

        // 5. Validate seatClassConfigs (must select at least one)
        if (!Array.isArray(formData.seatClassConfigs) || !formData.seatClassConfigs.length) {
            errors.seatClassConfigs = "At least one seat class configuration is required.";
        } else {
            formData.seatClassConfigs.forEach((cfg, idx) => {
                if (!cfg.rowCount || isNaN(cfg.rowCount) || cfg.rowCount <= 0) {
                    errors[`seatClassConfigs.${idx}.rowCount`] = "Row count must be a positive integer.";
                }
                if (!cfg.columnCount || isNaN(cfg.columnCount) || cfg.columnCount <= 0) {
                    errors[`seatClassConfigs.${idx}.columnCount`] = "Column count must be a positive integer.";
                }
                if (cfg.seatQuantity != null) {
                    if (isNaN(cfg.seatQuantity) || cfg.seatQuantity < 0) {
                        errors[`seatClassConfigs.${idx}.seatQuantity`] = "Seat quantity must be zero or a positive number.";
                    }
                }
            });
        }

        // 6. Check duplicate model
        const duplicate = airplanes.find(ap =>
            ap.model.toLowerCase() === formData.model.toLowerCase() &&
            ap.id !== currentAirplane?.id
        );
        if (duplicate) {
            errors.model = "An airplane with this model already exists.";
        }

        // 7. If errors, show and abort
        if (Object.keys(errors).length) {
            setErrorMessage(errors);
            return;
        }

        try {
            setErrorMessage({});
            let response;
            const url = currentAirplane
                ? `${SERVER_API}/airplanes/${currentAirplane.id}`
                : `${SERVER_API}/airplanes`;
            const method = currentAirplane ? 'PUT' : 'POST';

            response = await fetchWithToken(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errJson = await response.json();
                alert(`Error: ${errJson.message || 'Unknown error'}`);
            } else {
                alert(currentAirplane ? "Airplane updated successfully" : "Airplane added successfully");
                setShowForm(false);
                fetchAirplanes();
            }
        } catch (err) {
            console.error(err);
            alert("An unexpected error occurred. Please try again.");
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
