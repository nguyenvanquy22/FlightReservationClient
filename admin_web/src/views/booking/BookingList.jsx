import React, { useEffect, useState } from 'react';
import './BookingList.scss';
import config from '../config.json';
import * as XLSX from 'xlsx';
import BookingTable from '../../components/tables/BookingTable';
import Pagination from '../../components/Pagination/Pagination';
import { fetchWithToken } from '../fetchWithToken';
import Header from '../../components/header/Header';
import Loading from '../../components/loading/Loading';

const { SERVER_API } = config;

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState(""); // For search
    const bookingsPerPage = 10;
    const [loading, setLoading] = useState(false);

    // Fetching data on initial render and every 30 seconds
    useEffect(() => {
        fetchBookings();
    }, [currentPage]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await fetchWithToken(`${SERVER_API}/bookings`);
            const data = await response.json();
            setBookings(data.data.reverse());
            setTotalPages(Math.ceil(data.length / bookingsPerPage));
        } catch (error) {
            console.error('Error fetching booking list:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportToExcel = () => {
        // 1. Sort bookings theo ID
        const sortedBookings = [...bookings].sort((a, b) => a.id - b.id);

        // 2. Chuyển đổi dữ liệu thành dạng flat để xuất Excel
        const formattedData = sortedBookings.map(booking => {
            const user = booking.user || {};
            // Nếu mỗi booking có nhiều tickets, chúng ta nối chuỗi các giá trị lại
            const flightNumbers = booking.tickets
                .map(t => t.flightNumber || '')
                .filter(Boolean)
                .join('; ');
            const seatClasses = booking.tickets
                .map(t => t.seatClassName || '')
                .filter(Boolean)
                .join('; ');
            const passengerNames = booking.tickets
                .map(t => `${t.passenger.firstName} ${t.passenger.lastName}`)
                .join('; ');
            const seatNumbers = booking.tickets
                .map(t => t.seatNumber || '—')
                .join('; ');
            const ticketPrices = booking.tickets
                .map(t => parseFloat(t.price).toLocaleString('vi-VN'))
                .join('; ');
            const luggages = booking.tickets
                .flatMap(t => t.luggages || [])
                .map(l => `${l.type} ${l.weight}kg: ${l.price.toLocaleString('vi-VN')}`)
                .join('; ') || 'No Luggage';

            return {
                "Booking ID": booking.id,
                "Booking Date": new Date(booking.bookingDate).toLocaleString(),
                "User Email": user.email || 'Unknown',
                "Status": booking.status,
                "Tickets": booking.tickets.length,
                "Total Price": booking.totalPrice?.toLocaleString('vi-VN'),
                "Flight Numbers": flightNumbers,
                "Seat Classes": seatClasses,
                "Seat Numbers": seatNumbers,
                "Passenger Names": passengerNames,
                "Ticket Prices": ticketPrices,
                "Luggage Details": luggages
            };
        });

        // 3. Tạo worksheet và workbook rồi xuất file
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
        XLSX.writeFile(workbook, "Bookings_List.xlsx");
    };

    const filteredBookings = bookings.filter((booking) => {
        const user = booking.user;
        const userName = user ? user.email.toLowerCase() : '';
        const userPhone = user ? user.phoneNumber : '';
        const searchQuery = searchTerm.toLowerCase();


        return (
            userName.includes(searchQuery) ||
            String(userPhone).includes(searchQuery) ||
            String(booking.phoneNumber).includes(searchQuery)
        );
    });


    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const paginatedBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
    const totalFilteredPages = Math.ceil(filteredBookings.length / bookingsPerPage);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="container">
            <Header title={'Bookings'} />
            <div className="bookings-page content">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search bookings by username or phone number..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);  // Reset page to 1 when search term changes
                        }}
                    />
                </div>

                <button className="export-button" onClick={exportToExcel}>Export to Excel</button>

                <BookingTable bookings={paginatedBookings} />

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalFilteredPages}  // Use totalFilteredPages instead of totalPages
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default BookingList;
