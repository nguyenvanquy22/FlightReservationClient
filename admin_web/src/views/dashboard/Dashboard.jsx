// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import StatisticCard from '../../components/cards/StatisticCard';
import TrafficChart from '../../components/charts/TrafficChart';
import RevenueChart from '../../components/charts/RevenueChart';
import TopFlightTable from '../../components/tables/TopFlightTable';
import Pagination from '../../components/Pagination/Pagination';
import { fetchWithToken } from '../fetchWithToken';
import config from '../config.json';
import './Dashboard.scss';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import Header from '../../components/header/Header';
import Loading from '../../components/loading/Loading';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const { SERVER_API } = config;

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [bookingall, setbookingall] = useState([]);
  const [flights, setFlights] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const flightsPerPage = 5;
  const [filterType, setFilterType] = useState('month');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [bookingsRes, flightsRes, usersRes] = await Promise.all([
          fetchWithToken(`${SERVER_API}/bookings`),
          fetchWithToken(`${SERVER_API}/flights`),
          fetchWithToken(`${SERVER_API}/users`)
        ]);

        const bookingsData = await bookingsRes.json();
        const flightsData = await flightsRes.json();
        const usersData = await usersRes.json();

        // Handle bookings
        const confirmedBookings = bookingsData.data.filter(
          (booking) => booking.status === 'CONFIRMED'
        );
        setBookings(confirmedBookings);
        setbookingall(bookingsData);

        // Handle flights
        setFlights(flightsData.data);

        // Handle users
        setUsers(usersData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // đảm bảo chạy cuối cùng
      }
    };

    fetchAllData();
  }, []);

  const totalUsers = users.length;
  const totalFlights = flights.length;
  const totalBookings = bookings.length;
  const totalIncome = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

  const calculateRevenue = (type) => {
    const revenueByTime = {};
    bookings.forEach(booking => {
      const bookingDate = new Date(booking.bookingDate);
      let timeKey;
      if (type === 'month') {
        if (bookingDate.getFullYear() === selectedYear) {
          timeKey = bookingDate.toLocaleString('en-US', { month: 'long' });
        }
      } else if (type === 'year') {
        timeKey = `${bookingDate.getFullYear()}`;
      } else {
        if (bookingDate.getFullYear() === selectedYear && (bookingDate.getMonth() + 1) === selectedMonth) {
          timeKey = `${bookingDate.getDate()}`;
        }
      }
      if (timeKey) {
        revenueByTime[timeKey] = (revenueByTime[timeKey] || 0) + booking.totalPrice;
      }
    });

    const sortedRevenue = Object.keys(revenueByTime)
      .sort((a, b) => {
        if (type === 'month') {
          const monthOrder = {
            January: 1, February: 2, March: 3, April: 4,
            May: 5, June: 6, July: 7, August: 8,
            September: 9, October: 10, November: 11, December: 12
          };
          return monthOrder[a] - monthOrder[b];
        } else {
          return parseInt(a) - parseInt(b);
        }
      })
      .reduce((obj, key) => {
        obj[key] = revenueByTime[key];
        return obj;
      }, {});
    return sortedRevenue;
  };

  const revenueData = calculateRevenue(filterType);


  const getTopFlights = () => {
    const flightCountMap = {};

    bookings.forEach((booking) => {
      if (booking.status === 'CONFIRMED') {
        const flightId = booking.flightId;
        flightCountMap[flightId] = (flightCountMap[flightId] || 0) + 1;
      }
    });

    const topFlightIds = Object.entries(flightCountMap)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 10)
      .map(([flightId]) => parseInt(flightId));

    const topFlightsWithCount = flights
      .filter(flight => topFlightIds.includes(flight.id))
      .map(flight => ({
        ...flight,
        bookingCount: flightCountMap[flight.id]
      }));

    return topFlightsWithCount;
  };


  const topFlights = getTopFlights();


  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = topFlights.slice(indexOfFirstFlight, indexOfLastFlight);
  const totalPages = Math.ceil(topFlights.length / flightsPerPage);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="dashboard-container">
      <Header title={'Dashboard'} />
      <div className="dashboard content">
        <div className="statistics">
          <StatisticCard title="Total Users" value={totalUsers} icon="👥" color="#6f42c1" />
          <StatisticCard title="Total Flights" value={totalFlights} icon="✈️" color="#007bff" />
          <StatisticCard title="Total Bookings" value={totalBookings} icon="📑" color="#ffc107" />
          <StatisticCard title="Total Income" value={`${totalIncome.toLocaleString('vi-VN')} VND`} icon="💰" color="#28a745" />
        </div>

        <div className="charts">
          <TrafficChart />
        </div>

        {/*<div className="chart_revenue">
          <RevenueChart
            revenueData={revenueData}
            filterType={filterType}
            setFilterType={setFilterType}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        </div>*/}

        {/* Flights Table */}
        {/* <TopFlightTable flights={currentFlights} /> */}

        {/* <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        /> */}

      </div>
    </div>
  );
}

export default Dashboard;
