import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { fetchWithToken } from '../components/fetchWithToken';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const url = 'http://localhost:8080';
    const [isRoundTrip, setIsRoundTrip] = useState(false);
    const [isRoundTrip1, setIsRoundTrip1] = useState(false);
    const [token, setToken] = useState('');
    const [place, setPlace] = useState([]);
    const [place1, setPlace1] = useState('');
    const [place2, setPlace2] = useState('');
    const [flights, setFlights] = useState([]);
    const [order, setOrder] = useState([]);
    const [confirm, setConfirm] = useState([]);
    const [adults, setAdults] = useState(1)
    const [newFlights, setNewFlights] = useState([]);
    const [searchedFlights, setSearchedFlights] = useState([]);
    const [user, setUser] = useState({});
    const [myorder, setMyorder] = useState([]);
    const [urlPaymen, setUrlPaymen] = useState("");
    const [priceRoundTrip, setPriceRoundTrip] = useState(0);
    // const [myTicket, setMyTicket] = useState({});
    // const [selectedFlight, setSelectedFlight] = useState({});

    const login = async () => {
        try {
            const response = await axios.post(`${url}/api/auth/login`, {
                email: ''
            });
            setToken(response.data.token);
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }

    const fetchPlaceList = async () => {
        try {
            const token = localStorage.getItem("customerToken"); // Lấy token từ localStorage
            if (!token) {
                console.error("Token is missing");
                return;
            }
            const response = await axios.get(`${url}/api/airports/all`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Kèm token vào header
                },
            });
            setPlace(response.data);
        } catch (error) {
            console.error("Error fetching place list:", error);
        }
    };

    const fetchFlightsList = async () => {
        try {
            const token = localStorage.getItem("customerToken"); // Lấy token từ localStorage
            if (!token) {
                console.error("Token is missing");
                return;
            }
            const response = await axios.get(`${url}/api/flights/all`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Kèm token vào header
                },
            });
            setFlights(response.data);
        } catch (error) {
            console.error("Error fetching flight list:", error);
        }
    };

    const fetchUser = async () => {
        // if(token){
        try {
            const token = localStorage.getItem("customerToken");
            const userId = localStorage.getItem("userId");
            if (!token) {
                console.error("Token is missing");
                return;
            }
            const response = await axios.get(`${url}/api/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
        // }
    };


    const fetchMyorder = async () => {
        const token = localStorage.getItem("customerToken");
        if (!token) {
            console.error("Token is missing");
            return;
        }
        if (localStorage.getItem("userId")) {
            let i = 1;
            while (i !== 0) {
                try {
                    const response = await axios.get(`${url}/api/bookings/${i}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.data !== null) {
                        setMyorder((prevOrders) => [...prevOrders, response.data]);
                    }
                    i++;
                } catch (error) {
                    console.error("Error fetching my orders:", error);
                    i = 0;
                }
            }
        }
    };


    const countAdult = (count) => {
        setAdults(count)
        console.log("Số lượng: ", adults)
    }

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    const searchTerm = (place1, place2, departureDate, returnDate) => {
        setPlace1(place1);
        setPlace2(place2);
        console.log("địa chỉ", place1, place2);
        let filter = [];
        const today = new Date();
        if (departureDate === "") {
            filter = flights.filter(flight =>
                flight.departureAirport.city === place1 &&
                flight.arrivalAirport.city === place2
                // && new Date(flight.departureTime) > today
            );
        } else {
            filter = flights.filter(flight =>
                flight.departureAirport.city === place1 &&
                flight.arrivalAirport.city === place2 &&
                flight.departureTime.includes(departureDate)
            );
        }

        setNewFlights(filter)
        setSearchedFlights(filter)
        console.log("Chuyến bay mới:", newFlights)
    }

    const searchTermReturn = (place1, place2, departureDate) => {
        setPlace1(place1);
        setPlace2(place2);

        // console.log("Ngày", (departureDate))
        let filter = [];
        const today = new Date();
        if (departureDate == "") {
            console.log("Ngày hiện sau đó:", sessionStorage.getItem('departureDate'));
            console.log("Ngày khởi hành:", sessionStorage.getItem('departureDateDontChose'));
            // new Date(flight.departureTime) > sessionStorage.getItem('departureDate')
            filter = flights.filter(flight => flight.departureAirport.city === place1 && flight.arrivalAirport.city === place2 && new Date(flight.departureTime) > today && new Date(flight.departureTime) > new Date(sessionStorage.getItem('departureDateDontChose')));
        } else {
            console.log("Ngày đi về:", (departureDate))
            console.log("Ngày khởi hành:", sessionStorage.getItem('departureDate'));
            filter = flights.filter(flight => flight.departureAirport.city === place1 && flight.arrivalAirport.city === place2 && flight.departureTime.includes(departureDate));
        }

        setNewFlights(filter)
        setSearchedFlights(filter)
        console.log("Chuyến bay mới:", newFlights)
    }


    const filterStop = (stop) => {
        if (stop === 0) {
            setNewFlights(searchedFlights.filter(flight => Array.isArray(flight.transitPointList) && flight.transitPointList.length === 0));
        }
        if (stop === 1) {
            setNewFlights(searchedFlights.filter(flight => Array.isArray(flight.transitPointList) && flight.transitPointList.length > 0));
        }
        if (stop === 2) {
            setNewFlights(searchedFlights);
        }
    }


    const booking = (flight) => {
        console.log("Chuyến bay được đặt:", typeof (flight), flight);
        setOrder(prevOrders => {
            const isFlightAlreadyOrdered = prevOrders.some(orderFlight => orderFlight.flightId === flight.flightId);
            if (!isFlightAlreadyOrdered) {
                return [...prevOrders, flight];
            }
            return prevOrders;
        });
    };

    const isConfirm = (flight) => {
        setConfirm(prevConfirm => {
            const isFlightAlreadyConfirmed = prevConfirm.some(orderFlight => orderFlight.flightId === flight.flightId);
            if (!isFlightAlreadyConfirmed) {
                return [...prevConfirm, flight];
            }
            return prevConfirm;
        })
    }

    // const isConfirm = (flight) => {
    //     setConfirm(prevConfirm => {
    //         const isFlightAlreadyConfirmed = prevConfirm.some(orderFlight => orderFlight.flightId === flight.flightId);
    //         if (!isFlightAlreadyConfirmed) {
    //             return [flight];
    //         }
    //         return prevConfirm;
    //     })
    // }


    const formatTime = (timeString) => {
        const date = new Date(timeString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };


    const calculateDuration = (departureTime, arrivalTime) => {
        const departureDate = new Date(departureTime);
        const arrivalDate = new Date(arrivalTime);
        const durationInMinutes = Math.round((arrivalDate - departureDate) / (1000 * 60));

        const hours = Math.floor(durationInMinutes / 60);
        const minutes = durationInMinutes % 60;
        return `${hours}h ${minutes}m`;
    };

    const formatDate = (timeString) => {
        const date = new Date(timeString);
        return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const calculateDaysOvernight = (departureTime, arrivalTime) => {
        const departureDate = new Date(departureTime);
        const arrivalDate = new Date(arrivalTime);

        // Lấy ngày khởi hành và ngày hạ cánh
        const departureDateOnly = new Date(departureDate.getFullYear(), departureDate.getMonth(), departureDate.getDate());
        const arrivalDateOnly = new Date(arrivalDate.getFullYear(), arrivalDate.getMonth(), arrivalDate.getDate());

        let days = 0;

        // Kiểm tra xem chuyến bay có qua đêm không
        if (arrivalDate > departureDate) {
            days += (arrivalDateOnly - departureDateOnly) / (1000 * 60 * 60 * 24);
        }

        return Math.floor(days);
    };

    const postBooking = async (data) => {
        try {
            const token = localStorage.getItem("customerToken");
            if (!token) {
                console.error("Token is missing");
                return;
            }

            const response = await axios.post(`${url}/api/bookings/add`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            console.log("Booking successful:", response.data);
            const { bookingId, message, paymentUrl } = response.data;
            console.log("Booking ID:", bookingId);
            console.log("Message:", message);
            console.log("Payment URL:", paymentUrl);
            setUrlPaymen(paymentUrl);

            const width = 600;
            const height = 400;
            const left = window.screenX + (window.innerWidth / 2) - (width / 2);
            const top = window.screenY + (window.innerHeight / 2) - (height / 1);
            window.open(paymentUrl, "PopupWindow", `width=${width},height=${height},top=${top},left=${left}`);
        } catch (error) {
            console.error("Error making booking:", error);
        }
    };


    const formatCurrency = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const totalPriceRoundTrip = (flight, ad) => {
        if (!isRoundTrip) {
            return flight * ad;
        }
        setPriceRoundTrip(flight * 0.80);
        return flight * ad * 0.80;
    }

    // setPriceRoundTrip(totalPriceRoundTrip);

    useEffect(() => {
        fetchPlaceList();
        fetchFlightsList();
        fetchUser();
        fetchMyorder();
    }, []);

    useEffect(() => {
        // console.log("Đơn hàng hiện tại:", typeof (order), order);
    }, [order]);

    useEffect(() => {
        // console.log("Đơn hàng hiện tại:", typeof (myorder), myorder);
    }, [myorder]);

    useEffect(() => {
        // console.log("NewFlights:", typeof (newFlights), newFlights);
    }, [newFlights]);

    useEffect(() => {
        // console.log("searchedFlights:", typeof (searchedFlights), searchedFlights);
    }, [searchedFlights]);

    useEffect(() => {
        // console.log("searchedFlights:", typeof (searchedFlights), searchedFlights);
    }, [flights]);

    // useEffect(() => {
    //     console.log("Địa chỉ 1:", place1);
    // }, priceRoundTrip);

    useEffect(() => {
    }, [place1, place2]);

    const contextValue = {
        url,
        token,
        flights,
        newFlights,
        place,
        place1,
        place2,
        user,
        order,
        confirm,
        adults,
        urlPaymen,
        myorder,
        isRoundTrip,
        isRoundTrip1,
        priceRoundTrip,
        token,
        fetchUser,
        setUser,
        setToken,
        setPriceRoundTrip,
        setPlace1,
        setPlace2,
        setIsRoundTrip,
        setIsRoundTrip1,
        fetchMyorder,
        formatPrice,
        searchTerm,
        searchTermReturn,
        filterStop,
        booking,
        isConfirm,
        formatTime,
        calculateDuration,
        formatDate,
        calculateDaysOvernight,
        countAdult,
        postBooking,
        formatCurrency,
        totalPriceRoundTrip
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;