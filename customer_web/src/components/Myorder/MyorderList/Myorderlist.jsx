import React, { useContext, useEffect, useState } from 'react';
import './Myorderlist.scss';
import { StoreContext } from '../../../context/StoreContext';
import { Link } from 'react-router-dom';
import Footer from '../../Footer/Footer';
import TicketBooking from '../../TicketBooking/TicketBooking';


const Myorderlist = () => {
    const { myorder, token, fetchMyorder } = useContext(StoreContext);
    // useEffect(() => {
    //     console.log(myorder);
    // }, [myorder]);
    if (token) {
        setTimeout(() => {
            // fetchMyorder();
        }, 5000);
    }

    return (
        <div className='orderlist'>
            <main className="order-list">
                <h2>My Order List</h2>

                <div className="order-tabs">
                    <span>All</span>
                    <span>Issued</span>
                    <span>Confirmed</span>
                    <span>Waiting</span>
                    <span>Cancelled</span>
                    <span>
                        <input type="text" id="search-input" placeholder="Search..." />
                        <button id="search-button">Search</button>
                    </span>
                </div>

                <div className="main-content-orderlist">
                    {myorder.map((flight, index) => {
                        if (flight.user?.id == localStorage.getItem("userId")) {
                            return <TicketBooking key={index} myTicket={flight} />;
                        }
                    })}
                </div>
            </main>
        </div>
    );
};

export default Myorderlist;
