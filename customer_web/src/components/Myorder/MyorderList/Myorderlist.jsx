import React, { useContext, useEffect, useState } from 'react';
import './Myorderlist.scss';
import { StoreContext } from '../../../context/StoreContext';
import BookingItem from '../../BookingItem/BookingItem';

const Myorderlist = () => {
    const { myOrders, token, fetchMyOrders } = useContext(StoreContext);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        if (token) fetchMyOrders();
    }, []);

    // Tính tổng số trang
    const totalPages = Math.ceil(myOrders.length / itemsPerPage);

    // Lấy slice tương ứng trang hiện tại
    const paginatedBookings = myOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div className='orderlist'>
            <main className="order-list">
                <h2>My Orders List</h2>

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
                    {paginatedBookings.map((booking) => (
                        <BookingItem key={booking.id} booking={booking} />
                    ))}

                    {myOrders.length === 0 && <p>Bạn chưa có đơn nào.</p>}
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>

                        {/* hiển thị số trang: */}
                        {[...Array(totalPages)].map((_, idx) => {
                            const page = idx + 1;
                            return (
                                <button
                                    key={page}
                                    className={page === currentPage ? "active" : ""}
                                    onClick={() => goToPage(page)}
                                >
                                    {page}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Myorderlist;
