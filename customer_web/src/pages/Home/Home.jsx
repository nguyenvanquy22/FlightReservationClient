import React from "react";
import './Home.scss';
import Header from '../../components/Header/Header';
import OrderFlight from "../../components/OrderFlight/OrderFlight";
import Footer from "../../components/Footer/Footer";

const Home = () => {
    return (
        <div className="Header">
            <Header />
            <OrderFlight />
            <Footer />
        </div>
    );
};

export default Home;