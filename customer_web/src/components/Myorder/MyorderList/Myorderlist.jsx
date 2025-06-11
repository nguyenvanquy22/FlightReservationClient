import React, { useContext, useEffect, useState } from 'react';
import './Myorderlist.scss';
import { StoreContext } from '../../../context/StoreContext';
import BookingItem from '../../BookingItem/BookingItem';

const STATUSES = [
    { label: 'All', value: '' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Cancelled', value: 'CANCELLED' },
    { label: 'Payment Failed', value: 'PAYMENT_FAILED' },
];

const Myorderlist = () => {
    const { myOrders, token, fetchMyOrders } = useContext(StoreContext);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [bookingStatus, setBookingStatus] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                setCurrentPage(1);
                await fetchMyOrders(bookingStatus);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error)
            }
        }
        if (token) {
            fetchOrders();
        }
    }, [bookingStatus, token]);

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
                    {STATUSES.map((st) => (
                        <span
                            key={st.value}
                            className={st.value === bookingStatus ? 'active' : ''}
                            onClick={() => setBookingStatus(st.value)}
                        >
                            {st.label}
                        </span>
                    ))}
                    <span>
                        <input type="text" id="search-input" placeholder="Search..." />
                        <button id="search-button">Search</button>
                    </span>
                </div>

                {!loading ? (
                    <div className="main-content-orderlist">
                        {paginatedBookings.map((booking) => (
                            <BookingItem key={booking.id} booking={booking} />
                        ))}

                        {myOrders.length === 0 && <p className='empty-orders'>Không có đơn nào.</p>}
                    </div>
                ) : (
                    <div style={{ textAlign: "center", padding: '50px' }}>Loading...</div>
                )}


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
