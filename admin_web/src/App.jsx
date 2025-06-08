import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Dashboard from "./views/dashboard/Dashboard";
import Users from "./views/user/Users";
import DetailOrderlist from "./views/detailorder/DetailOrderlist";
import AirplaneList from "./views/airplane/AirplaneList";
import AirlineList from "./views/airline/AirlineList";
import Flightlist from "./views/flight/FlightList";
import AirportList from "./views/airport/AirportList";
import BookingList from "./views/booking/BookingList";
import AdminLoginPage from "./views/login/AdminLoginPage";
import "./App.scss";

// PrivateRoute component
const PrivateRoute = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem("adminToken");
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

// AdminLayout component
const AdminLayout = ({ children }) => (
  <div className="app-container">
    <Sidebar />
    <div className="main-content">
      {children}
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AdminLoginPage />} />
        <Route
          path="/*"
          element={
            <PrivateRoute
              element={
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="users" element={<Users />} />
                    <Route path="details/:id" element={<DetailOrderlist />} />
                    <Route path="airplanes" element={<AirplaneList />} />
                    <Route path="airlines" element={<AirlineList />} />
                    <Route path="flights" element={<Flightlist />} />
                    <Route path="airports" element={<AirportList />} />
                    <Route path="bookings" element={<BookingList />} />
                  </Routes>
                </AdminLayout>
              }
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
