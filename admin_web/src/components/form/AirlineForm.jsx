import React from 'react';
import './styles/AirlineForm.scss';

const AirlineForm = ({ currentAirline, onSubmit, onCancel, errorMessage }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onCancel}>&times;</span>
                <h3>{currentAirline ? "Edit Airline" : "Add Airline"}</h3>
                <form onSubmit={onSubmit}>
                    <label>
                        Airline Name:
                        <input
                            name="name"
                            type="text"
                            defaultValue={currentAirline?.name || ""}
                            required
                        />
                        {errorMessage?.name && <span className="error">{errorMessage.name}</span>}
                    </label>
                    <label>
                        Airline IATA Code:
                        <input
                            name="iataCode"
                            type="text"
                            maxLength="2"
                            defaultValue={currentAirline?.iataCode || ""}
                            required
                        />
                        {errorMessage?.iataCode && <span className="error">{errorMessage.iataCode}</span>}
                    </label>
                    <label>
                        Airline ICAO Code:
                        <input
                            name="icaoCode"
                            type="text"
                            maxLength="3"
                            defaultValue={currentAirline?.icaoCode || ""}
                            required
                        />
                        {errorMessage?.icaoCode && <span className="error">{errorMessage.icaoCode}</span>}
                    </label>
                    <div className="button-container">
                        <button type="submit" className="submit-button">{currentAirline ? "Save Changes" : "Add Airline"}</button>
                        <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AirlineForm;
