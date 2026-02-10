import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "../style/MyRides.css"


export default function MYRides() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        const fetchMyRides = async () => {
            try {
                const res = await API.get("/ride/my-rides", {
                    withCredentials: true
                });
                setBookings(res.data.booking || []);
            } catch (err) {
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        };

        fetchMyRides();


    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Navbar />
            <div className="myrides-container">
                <h2>My Booked Rides</h2>

                {bookings.length === 0 ? (
                    <p className="empty">No rides booked yet.</p>
                ) : (
                    bookings.map((b) => (
                        <div key={b._id} className="ride-card">
                            <div className="ride-row">
                                <span><b>From:</b> {b.ride.source}</span>
                                <span><b>To:</b> {b.ride.destination}</span>
                            </div>

                            <div className="ride-row">
                                <span><b>Date:</b> {b.ride.date}</span>
                                <span><b>Time:</b> {b.time}</span>
                            </div>

                            <div className="ride-row">
                                <span><b>Seats:</b> {b.bookingSeats}</span>
                                <span className={`status ${b.status}`}>
                                    {b.status.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );


}