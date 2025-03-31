import React from 'react';
import './styles/AirportTable.scss'
const AirportTable = ({ airports, onEdit, onDelete }) => {
  return (
    <table className="airport-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>IATA Code</th>
          <th>ICAO Code</th>
          <th>City</th>
          <th>Country</th>
          <th>Address</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {airports.map((airport) => (
          <tr key={airport.id}>
            <td>{airport.name}</td>
            <td>{airport.code}</td>
            <td>{airport.code}</td>
            <td>{airport.city}</td>
            <td>{airport.country}</td>
            <td>{airport.country}</td>
            <td>
              <button onClick={() => onEdit(airport)} className="edit_button">
                Edit
              </button>
              <button onClick={() => onDelete(airport.id)} className="delete_button">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AirportTable;
