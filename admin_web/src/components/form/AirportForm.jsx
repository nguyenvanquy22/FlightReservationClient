import React from 'react';
import './styles/AirportForm.scss'
const AirportForm = ({ currentAirport, onSubmit, onCancel, errorMessage }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close-button" onClick={onCancel}>&times;</span>
                <h3>{currentAirport ? "Edit Airport" : "Add Airport"}</h3>
                <form onSubmit={onSubmit}>
                    <label>
                        Name:
                        <input
                            name="name"
                            type="text"
                            maxLength="15"
                            defaultValue={currentAirport?.name || ""}
                            required
                        />
                        {errorMessage?.name && <span className="error">{errorMessage.name}</span>}
                    </label>
                    <label>
                        IATA Code:
                        <input
                            name="iataCode"
                            type="text"
                            maxLength="3"
                            defaultValue={currentAirport?.iataCode || ""}
                            required
                        />
                        {errorMessage?.iataCode && <span className="error">{errorMessage.iataCode}</span>}
                    </label>
                    <label>
                        ICAO Code:
                        <input
                            name="icaoCode"
                            type="text"
                            maxLength="4"
                            defaultValue={currentAirport?.icaoCode || ""}
                            required
                        />
                        {errorMessage?.icaoCode && <span className="error">{errorMessage.icaoCode}</span>}
                    </label>
                    <label>
                        City:
                        <input
                            name="city"
                            type="text"
                            defaultValue={currentAirport?.city || ""}
                            required
                        />
                        {errorMessage?.city && <span className="error">{errorMessage.city}</span>}
                    </label>
                    <label>
                        Country:
                        <input
                            name="country"
                            type="text"
                            defaultValue={currentAirport?.country || ""}
                            required
                        />
                        {errorMessage?.country && <span className="error">{errorMessage.country}</span>}
                    </label>
                    <label>
                        Address:
                        <input
                            name="address"
                            type="text"
                            defaultValue={currentAirport?.address || ""}
                            required
                        />
                        {errorMessage?.address && <span className="error">{errorMessage.address}</span>}
                    </label>
                    <button type="submit" className="submit-button">{currentAirport ? "Save Changes" : "Add Airport"}</button>
                    <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default AirportForm;
