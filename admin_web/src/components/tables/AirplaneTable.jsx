import React from 'react';
import './styles/AirplaneTable.scss'

const AirplaneTable = ({ currentAirplanes, onEdit, onDelete }) => {
  return (
    <table className="aircraft-table">
      <thead>
        <tr>
          <th>Model</th>
          <th>Registration code</th>
          <th>Airline</th>
          <th>Total Seats</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {currentAirplanes.map((airplane) => (
          <tr key={airplane.id}>
            <td>{airplane.model}</td>
            <td>{airplane.registrationCode}</td>
            <td>{airplane.airline.name}</td>
            <td>{airplane.capacity}</td>
            <td>{airplane.status}</td>
            <td>
              <button onClick={() => onEdit(airplane)} className="edit-button">
                Edit
              </button>
              <button onClick={() => onDelete(airplane.id)} className="delete-button">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AirplaneTable;
