import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import MyOrder from './pages/MyOrders/MyOrder'
import Flight from './pages/Flight/Flight'
import Booking from './pages/Booking/Booking'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Confirm from './pages/Confirm/Confirm'
import Thank from './pages/Thank/Thank'
import Success from './pages/Success/Success'

function App() {
  const [showLogin, setShowLogin] = useState(false)
  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <Navbar setShowLogin={setShowLogin} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flight" element={<Flight />} />
        <Route path="/myorder/*" element={<MyOrder />} />
        <Route path="/contact" element={<Home />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/booking/success" element={<Thank />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </>
  )
}

export default App
