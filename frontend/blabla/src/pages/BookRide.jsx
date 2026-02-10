import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import "../style/BookRide.css"

export default function BookRide() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const ride = state?.ride;
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [bookingSeats, setBookingSeats] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ride) {
      navigate("/rides");
    } else if (!user) {
      navigate("/login");
    } else if (user._id === ride.driver._id) {
      alert("You cannot book your own ride");
      navigate("/rides");
    }
  }, [ride, user, navigate]);


  if (!ride || !user) {
    return <p>Loading...</p>;
  }

  const handleBooking = async () => {

    setLoading(true);

    const bookingData = {
      ride: ride._id,
      passenger: user._id,
      bookingSeats,
      status: "pending",
      time: ride.time
    };

    try {
      await API.post("/ride/book", bookingData, {
        withCredentials: true,
      });
      alert("Ride booking request sent!");
      navigate("/");
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message || "Booking failed. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bookride-container">
        <h2>Book Ride</h2>

        <div className="card">
          <p><b>From:</b> {ride.source}</p>
          <p><b>To:</b> {ride.destination}</p>
          <p><b>Date:</b> {ride.date}</p>
          <p><b>Time:</b> {ride.time}</p>
          <p><b>Driver:</b> {ride.driver.name}</p>
        </div>

        <div className="card">
          <label>Seats</label>
          <select
            value={bookingSeats}
            onChange={e => setBookingSeats(Number(e.target.value))}
          >
            {[...Array(ride.seats)].map((_, i) => (
              <option key={i} value={i + 1}>{i + 1}</option>
            ))}
          </select>

          <div className="price">
            Total: ₹ {bookingSeats * ride.price}
          </div>
        </div>

        <button
          className="book-btn"
          onClick={handleBooking}
          disabled={loading}
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </>
  );
}
