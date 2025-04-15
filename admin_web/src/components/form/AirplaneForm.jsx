import React from 'react';
import './styles/AirplaneForm.scss';

const AirplaneForm = ({ currentAirplane, onSubmit, onCancel, errorMessage }) => {
    return (
        <div className="aircraft-form-container">
            <h3>{currentAirplane ? "Edit Airplane" : "Add Airplane"}</h3>
            <form onSubmit={onSubmit}>
                <label>
                    Airplane Model:
                    <input
                        name="model"
                        type="text"
                        defaultValue={currentAirplane?.model || ""}
                        required
                    />
                    {errorMessage?.model && <span className="error">{errorMessage.model}</span>}
                </label>
                <label>
                    Registration Code:
                    <input
                        name="registrationCode"
                        type="text"
                        defaultValue={currentAirplane?.registrationCode || ""}
                        required
                    />
                    {errorMessage?.registrationCode && <span className="error">{errorMessage.registrationCode}</span>}
                </label>
                <label>
                    Airline:
                    <input
                        name="registrationCode"
                        type="text"
                        defaultValue={currentAirplane?.registrationCode || ""}
                        required
                    />
                    {errorMessage?.registrationCode && <span className="error">{errorMessage.registrationCode}</span>}
                </label>
                <label>
                    Status:
                    <input
                        name="registrationCode"
                        type="text"
                        defaultValue={currentAirplane?.registrationCode || ""}
                        required
                    />
                    {errorMessage?.registrationCode && <span className="error">{errorMessage.registrationCode}</span>}
                </label>
                <div className="button-group">
                    <button type="submit" className="submit-button">{currentAirplane ? "Save Changes" : "Add Airplane"}</button>
                    <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default AirplaneForm;
