import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

// Create separate contexts for different concerns
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const url = 'http://localhost:8080';

    // User and Authentication State
    const [token, setToken] = useState(localStorage.getItem('customerToken') || '');
    const [user, setUser] = useState({});

    // Flight Search State
    const [place, setPlace] = useState([]);  // List of airports
    const [place1, setPlace1] = useState(''); // Origin
    const [place2, setPlace2] = useState(''); // Destination
    const [isRoundTrip, setIsRoundTrip] = useState(false);
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');

    // Flight Lists
    const [flights, setFlights] = useState([]);
    const [searchedFlights, setSearchedFlights] = useState([]);
    const [newFlights, setNewFlights] = useState([]);

    // Booking State
    const [selectedDepartureFlight, setSelectedDepartureFlight] = useState(null);
    const [selectedReturnFlight, setSelectedReturnFlight] = useState(null);
    const [selectedSeatOption, setSelectedSeatOption] = useState(null);
    const [returnSeatOption, setReturnSeatOption] = useState(null);
    const [adults, setAdults] = useState(1);
    const [passengerDetails, setPassengerDetails] = useState([]);

    // Order and Payment
    const [urlPayment, setUrlPayment] = useState('');
    const [myOrders, setMyOrders] = useState([]);

    // Authentication Functions
    const login = async (email, password) => {
        try {
            const response = await axios.post(`${url}/api/auth/login`, {
                email,
                password
            });
            const { token, user } = response.data;
            localStorage.setItem('customerToken', token);
            localStorage.setItem('userId', user.id);
            setToken(token);
            await fetchUser(user.id, token);
            return true;
        } catch (error) {
            console.error('Error logging in:', error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('customerToken');
        localStorage.removeItem('userId');
        setToken('');
        setUser({});
    };

    // Data Fetching Functions
    const fetchPlaceList = async () => {
        try {
            if (!token) {
                console.error("Token is missing");
                return;
            }
            const response = await axios.get(`${url}/api/airports`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPlace(response.data.data);
        } catch (error) {
            console.error("Error fetching place list:", error);
        }
    };

    const fetchFlightsList = async () => {
        try {
            if (!token) {
                console.error("Token is missing");
                return;
            }
            const response = await axios.get(`${url}/api/flights`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFlights(response.data.data);
        } catch (error) {
            console.error("Error fetching flight list:", error);
        }
    };

    const fetchUser = async (userId = localStorage.getItem('userId'), authToken = token) => {
        try {
            if (!authToken || !userId) {
                console.error("Token or userId is missing");
                return;
            }
            const response = await axios.get(`${url}/api/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            setUser(response.data.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const fetchMyOrders = async () => {
        try {
            const authToken = localStorage.getItem("customerToken");
            const userId = localStorage.getItem("userId");

            if (!authToken || !userId) {
                console.error("Token or userId is missing");
                return;
            }

            // Clear previous orders
            setMyOrders([]);

            const response = await axios.get(`${url}/api/bookings/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.data && Array.isArray(response.data.data)) {
                setMyOrders(response.data.data.reverse());
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    // Flight Search Functions
    const searchFlights = (origin, destination, departureDate) => {
        setSelectedDepartureFlight(null);
        setSelectedReturnFlight(null);
        setPlace1(origin);
        setPlace2(destination);
        setDepartureDate(departureDate);

        let filteredFlights;
        const today = new Date();

        if (!departureDate) {
            filteredFlights = flights.filter(flight =>
                flight.originAirport.city === origin &&
                flight.destinationAirport.city === destination
                && new Date(flight.departureTime) > today
            );
        } else {
            // Format the date to match the format used in flight.departureTime
            const formattedDate = departureDate.split('T')[0];
            filteredFlights = flights.filter(flight =>
                flight.originAirport.city === origin &&
                flight.destinationAirport.city === destination &&
                flight.departureTime.includes(formattedDate)
            );
        }

        filteredFlights = filteredFlights.filter(flight =>
            flight.seatOptions && flight.seatOptions.length > 0 &&
            flight.seatOptions.some(option => option.availableSeats > 0)
        )

        setNewFlights(filteredFlights);
        setSearchedFlights(filteredFlights);
    };

    const searchReturnFlights = (origin, destination, minDateTime, returnDate) => {
        setReturnDate(returnDate);

        let filteredFlights;

        if (!returnDate) {
            filteredFlights = flights.filter(flight =>
                flight.originAirport.city === origin &&
                flight.destinationAirport.city === destination &&
                new Date(flight.departureTime) > new Date(minDateTime)
            );
        } else {
            const formattedDate = returnDate.split('T')[0];
            filteredFlights = flights.filter(flight =>
                flight.originAirport.city === origin &&
                flight.destinationAirport.city === destination &&
                flight.departureTime.includes(formattedDate)
            );
        }

        filteredFlights = filteredFlights.filter(flight =>
            flight.seatOptions && flight.seatOptions.length > 0 &&
            flight.seatOptions.some(option => option.availableSeats > 0)
        )

        setNewFlights(filteredFlights);
        setSearchedFlights(filteredFlights);
    };

    // Filter Functions
    const filterByStops = (stopCount) => {
        if (stopCount === 0) {
            setNewFlights(searchedFlights.filter(flight =>
                !flight.transits || flight.transits.length === 0
            ));
        } else if (stopCount === 1) {
            setNewFlights(searchedFlights.filter(flight =>
                flight.transits && flight.transits.length > 0
            ));
        } else {
            setNewFlights(searchedFlights);
        }
    };

    const filterByPrice = (minPrice, maxPrice) => {
        setNewFlights(searchedFlights.filter(flight => {
            // Find the cheapest seat option
            const cheapestSeat = flight.seatOptions.reduce((min, option) =>
                option.seatPrice < min.seatPrice ? option : min,
                flight.seatOptions[0]);

            return cheapestSeat && cheapestSeat.seatPrice >= minPrice && cheapestSeat.seatPrice <= maxPrice;
        }));
    };

    // Selection and Booking Functions
    const selectFlight = (flight, isReturn = false) => {
        if (isReturn) {
            setSelectedReturnFlight(flight);
        } else {
            setSelectedDepartureFlight(flight);
        }
    };

    const selectSeatOption = (seatOption, isReturn = false) => {
        if (isReturn) {
            setReturnSeatOption(seatOption);
        } else {
            setSelectedSeatOption(seatOption);
        }
    };

    const updatePassengerCount = (count) => {
        const newCount = Math.max(1, count); // Ensure at least 1 passenger
        setAdults(newCount);

        // Initialize passenger details array with the right number of passengers
        setPassengerDetails(prevDetails => {
            const newDetails = [...prevDetails];

            // Add new passengers if needed
            while (newDetails.length < newCount) {
                newDetails.push({
                    firstName: '',
                    lastName: '',
                    dateOfBirth: '',
                    phoneNumber: '',
                    passportNumber: '',
                    nationality: ''
                });
            }

            // Remove extra passengers if count decreased
            if (newDetails.length > newCount) {
                return newDetails.slice(0, newCount);
            }

            return newDetails;
        });
    };

    const updatePassengerDetail = (index, field, value) => {
        setPassengerDetails(prevDetails => {
            const newDetails = [...prevDetails];
            if (!newDetails[index]) {
                newDetails[index] = {};
            }
            newDetails[index][field] = value;
            return newDetails;
        });
    };

    const calculateTotalPrice = () => {
        if (!selectedDepartureFlight || !selectedSeatOption) {
            return 0;
        }

        let total = selectedSeatOption.seatPrice * adults;

        if (isRoundTrip && selectedReturnFlight && returnSeatOption) {
            // Apply 20% discount for round trip
            total += returnSeatOption.seatPrice * adults;
            total = total * 0.8;
        }

        return total;
    };

    const generatePaymentUrl = async (bookingId, amount) => {
        try {
            const authToken = localStorage.getItem("customerToken");
            const res = await axios.get(`${url}/api/payments/vn-pay`, {
                params: {
                    bookingId,
                    amount,
                    bankCode: 'NCB',
                },
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });
            // ApiResponse<String> trả về trong res.data.data
            return res.data.data;
        } catch (err) {
            console.error("Error generating payment URL:", err);
            return null;
        }
    };

    // Booking Submission
    const submitBooking = async () => {
        try {
            const authToken = localStorage.getItem("customerToken");
            if (!authToken) {
                console.error("Token is missing");
                return null;
            }

            // Validate required booking data
            if (!selectedDepartureFlight || !selectedSeatOption || passengerDetails.length === 0) {
                console.error("Missing required booking information");
                return null;
            }

            // Construct booking data
            const bookingData = {
                userId: user.id,
                flightBookingRequests: [
                    {
                        flightId: selectedDepartureFlight.id,
                        seatOptionId: selectedSeatOption.id
                    }
                ],
                passengersRequest: passengerDetails.map(passenger => ({
                    ...passenger,
                    email: passenger.email || user.email,
                    phoneNumber: passenger.phoneNumber || user.phoneNumber,
                })),
                totalPrice: calculateTotalPrice()
            };

            // Add return flight if applicable
            if (isRoundTrip && selectedReturnFlight && returnSeatOption) {
                bookingData.flightBookingRequests.push({
                    flightId: selectedReturnFlight.id,
                    seatOptionId: returnSeatOption.id
                });
            }

            const res = await axios.post(`${url}/api/bookings`, bookingData, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            const booking = res.data.data;
            console.log("Booking created:", booking);

            // 2.2. Sang bước tạo URL thanh toán
            const paymentUrl = await generatePaymentUrl(booking.id, booking.totalPrice);
            if (!paymentUrl) {
                alert("Không thể tạo URL thanh toán. Vui lòng thử lại.");
                return booking;
            }

            setUrlPayment(paymentUrl);

            // Open payment window
            // if (paymentUrl) {
            //     const width = 600, height = 400;
            //     const left = window.screenX + (window.innerWidth - width) / 2;
            //     const top = window.screenY + (window.innerHeight - height) / 2;
            //     window.open(paymentUrl, "PaymentWindow", `width=${width},height=${height},top=${top},left=${left}`);
            // }

            window.location.href = paymentUrl;

            return booking;
        } catch (error) {
            console.error("Error making booking:", error);
            return null;
        }
    };

    // Utility Functions
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const formatTime = (timeString) => {
        const date = new Date(timeString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const formatDate = (timeString) => {
        const date = new Date(timeString);
        return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const calculateDuration = (departureTime, arrivalTime) => {
        const departureDate = new Date(departureTime);
        const arrivalDate = new Date(arrivalTime);
        const durationInMinutes = Math.round((arrivalDate - departureDate) / (1000 * 60));

        const hours = Math.floor(durationInMinutes / 60);
        const minutes = durationInMinutes % 60;
        return `${hours}h ${minutes}m`;
    };

    const calculateDaysOvernight = (departureTime, arrivalTime) => {
        const departureDate = new Date(departureTime);
        const arrivalDate = new Date(arrivalTime);

        // Get departure and arrival dates only (without time)
        const departureDateOnly = new Date(departureDate.getFullYear(), departureDate.getMonth(), departureDate.getDate());
        const arrivalDateOnly = new Date(arrivalDate.getFullYear(), arrivalDate.getMonth(), arrivalDate.getDate());

        // Calculate days difference
        const daysDiff = Math.floor((arrivalDateOnly - departureDateOnly) / (1000 * 60 * 60 * 24));

        return daysDiff;
    };

    // Initialize data on component mount
    useEffect(() => {
        if (token) {
            fetchPlaceList();
            fetchFlightsList();
            fetchUser();
        }
    }, [token]);

    // Context value with all state and functions
    const contextValue = {
        // State
        url,
        token,
        user,
        place,
        place1,
        place2,
        flights,
        newFlights,
        searchedFlights,
        isRoundTrip,
        departureDate,
        returnDate,
        selectedDepartureFlight,
        selectedReturnFlight,
        selectedSeatOption,
        returnSeatOption,
        adults,
        passengerDetails,
        urlPayment,
        myOrders,

        // Authentication
        login,
        logout,
        setToken,

        // Data Fetching
        fetchUser,
        fetchPlaceList,
        fetchFlightsList,
        fetchMyOrders,

        // Flight Search and Filtering
        setPlace1,
        setPlace2,
        setIsRoundTrip,
        searchFlights,
        searchReturnFlights,
        filterByStops,
        filterByPrice,

        // Selection and Booking
        selectFlight,
        selectSeatOption,
        updatePassengerCount,
        updatePassengerDetail,
        calculateTotalPrice,
        submitBooking,

        // Utility Functions
        formatPrice,
        formatTime,
        formatDate,
        calculateDuration,
        calculateDaysOvernight
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;