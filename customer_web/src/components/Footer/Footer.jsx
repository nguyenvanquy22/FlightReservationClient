import React from "react";
import './Footer.scss';
import { assets } from "../../assets/assets";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer_container">
                <img className="partners" src={assets.partners} alt="logo" />
                <div className="seeall_partners">
                    <p>
                        See All Airline Partners
                    </p>
                </div>
            </div>
            <div className="footer_container2">
                <h1>Don't miss out!</h1>
                <p>Explore the world and stay anywhere conveniently</p>
                <div>
                    <div className="top_flights">
                        <div className="title_top_flights">
                            <p>Top Popular Flights</p>
                            <p>Top Popular Routes</p>
                        </div>
                        <hr />
                        <div className="list_top_flights">
                            <div>
                                <p>Flights to Bangkok</p>
                                <p>Flights to Singapore</p>
                                <p>Flights to Bali</p>
                                <p>Flights to Jakarta</p>
                            </div>
                            <div>
                                <p>Flights to Kuala Lumpur</p>
                                <p>Flights to Manila</p>
                                <p>Flights to Hong Kong</p>
                                <p>Flights to Seoul</p>
                            </div>
                            <div>
                                <p>Flights to Tokyo</p>
                                <p>Flights to Taipei</p>
                                <p>Flights to Sydney</p>
                                <p>Flights to Melbourne</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer_container3">
                <div className="footer_info">
                    <img className="footer" src={assets.footer} alt="logo" />
                </div>
                <div className="footer_airpaz">
                    Airpaz
                    <div>
                        <p>Home</p>
                        <p>Flights</p>
                        <p>Hotels</p>
                        <p>Trains</p>
                        <p>Car Rentals</p>
                        <p>Travel Insurance</p>
                        <p>Help</p>
                    </div>
                </div>
                <div className="footer_account">
                    Account
                    <div>
                        Chanhge password
                    </div>
                </div>
                <div className="footer_support">
                    Support
                    <div>
                        <p>Airpaz Guide</p>
                        <p>FAQ</p>
                        <p>Privacy Policy</p>
                        <p>How to Book</p>
                        <p>Terms of Use</p>
                        <p>Payment Method</p>
                    </div>
                </div>
                <div className="footer_follow">
                    Follow Us
                    <div>
                        <p>Facebook</p>
                        <p>Twitter</p>
                        <p>Instagram</p>
                        <p>Youtube</p>
                    </div>
                </div>
                <div className="footer_app">
                    Our App
                    <img className="app" src={assets.app} alt="logo" />
                </div>
            </div>
        </footer>
    );
}

export default Footer;