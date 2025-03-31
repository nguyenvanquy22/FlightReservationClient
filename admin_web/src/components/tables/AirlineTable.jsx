import React from 'react';
import './styles/AirlineTable.scss'
const AirlineTable = ({ airlines, handleEdit, handleDelete }) => {
    return (
        <table className="airline-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>IATA Code</th>
                    <th>ICAO Code</th>
                    <th className='action_column'>Actions</th>
                </tr>
            </thead>
            <tbody>
                {airlines.map((airline) => (
                    <tr key={airline.id}>
                        <td>{airline.name}</td>
                        <td>{airline.code}</td>
                        <td>{airline.code}</td>
                        <td className='action_column'>
                            <button onClick={() => handleEdit(airline)} className="edit_button">
                                Edit
                            </button>
                            <button onClick={() => handleDelete(airline.id)} className="delete_button">
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default AirlineTable;
