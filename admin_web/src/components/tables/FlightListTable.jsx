import React from 'react';
import './styles/FlightListTable.scss';

const FlightListTable = ({ flights, currentFlights, onEdit, onDelete }) => {
    return (
        <div className="table-responsive">
            <table className="flight-table">
                <thead>
                    <tr>
                        <th colSpan="4">Flight Info</th>
                        <th colSpan="4">Departure</th>
                        <th colSpan="4">Arrival</th>
                        <th rowSpan="2">Status</th>
                        <th colSpan="2">Transit Points</th>
                        <th rowSpan="2">Actions</th>
                    </tr>
                    <tr>
                        <th>Flight Number</th>
                        <th>Airplane Model</th>
                        <th>Total Seats</th>
                        <th>Airline Name</th>
                        <th>Departure Airport</th>
                        <th>Departure City</th>
                        <th>Departure Country</th>
                        <th>Departure Time</th>
                        <th>Arrival Airport</th>
                        <th>Arrival City</th>
                        <th>Arrival Country</th>
                        <th>Arrival Time</th>
                        <th>Arrival</th>
                        <th>Departure</th>
                    </tr>
                </thead>
                <tbody>
                    {currentFlights.map((flight) => (
                        <tr key={flight.id}>
                            <td>{flight.flightNumber}</td>
                            <td>{flight.airplane?.model || 'Unknown'}</td>
                            <td>{flight.airplane?.capacity || 'Unknown'}</td>
                            <td>{flight.airplane?.airline?.name || 'Unknown'}</td>

                            {/* Departure Info */}
                            <td>{flight.originAirport?.name || 'Unknown'}</td>
                            <td>{flight.originAirport?.city || 'Unknown'}</td>
                            <td>{flight.originAirport?.country || 'Unknown'}</td>
                            <td>{new Date(flight.departureTime).toLocaleString()}</td>

                            {/* Arrival Info */}
                            <td>{flight.destinationAirport?.name || 'Unknown'}</td>
                            <td>{flight.destinationAirport?.city || 'Unknown'}</td>
                            <td>{flight.destinationAirport?.country || 'Unknown'}</td>
                            <td>{new Date(flight.arrivalTime).toLocaleString()}</td>

                            <td>{flight.status}</td>

                            {/* Transit Points - Arrival and Departure */}
                            <td>
                                {flight?.transits?.length > 0 ? (
                                    flight.transits.map(point => (
                                        <div key={point?.id}>
                                            {point.airport?.airportName} ({point.airport?.city}, {point.airport?.country}) -
                                            Arrival: {new Date(point?.arrivalTime).toLocaleString()}
                                        </div>
                                    ))
                                ) : (
                                    'None'
                                )}
                            </td>
                            <td>
                                {flight?.transits?.length > 0 ? (
                                    flight.transits.map(point => (
                                        <div key={point?.id}>
                                            {point.airport?.airportName} ({point.airport?.city}, {point.airport?.country}) -
                                            Departure: {new Date(point?.departureTime).toLocaleString()}
                                        </div>
                                    ))
                                ) : (
                                    'None'
                                )}
                            </td>

                            <td>
                                <button onClick={() => onEdit(flight)} className="edit_button">Edit</button>
                                <button onClick={() => onDelete(flight.flightId)} className="delete_button">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FlightListTable;
