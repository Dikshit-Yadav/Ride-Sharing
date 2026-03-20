import "../style/PublicedRide.css"
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { Link } from "react-router-dom";

function PublicedRide() { 
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [passengers, setPassengers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchMyRides = async () => {
      try {
        const res = await API.get("/ride/publiced");
        setRides(res.data.rides || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRides();
  }, []);

const deleteRide = async (id) => {
  try {
    await API.delete(`/ride/delete/${id}`, { withCredentials: true });
    alert("Ride deleted successfully");
    setRides(rides => rides.filter(r => r._id !== id));
  } catch (err) {
    alert("Ride deletion failed");
  }
};

const handlePassenger = async (id) => {
  try {
    const res = await API.get(`/ride/passengers/${id}`, { withCredentials: true });
    setPassengers(res.data.bookings || []);
    setShowModal(true);
  } catch (err) {
    alert(err.response?.data?.message || "Failed to fetch passengers");
  }
};



  return (
    <>
      <Navbar />
      <h2 style={{
          textAlign: "center",
          position:"relative",
          top: "10vh"
        }}>My Published Rides</h2>
      <div className="container">
        

        {loading && <p>Loading...</p>}

        {!loading && (!rides || rides.length === 0) && (
          <p>You have not published any rides.</p>
        )}
        
        <div className="rides-list">
          {rides?.map((ride) => (
            <div key={ride._id} className="ride-card">
              <h3>
                {ride.source} → {ride.destination}
              </h3>
              <p>Date: {ride.date} | Time:{ride.time}</p>
              <p>Price: ₹{ride.price}</p>
              <p>Seats Available: {ride.seats}</p>
              <p>Driver: {ride.driver?.name || "N/A"}</p>
              <button onClick={() => deleteRide(ride._id)}>Delete</button>
               <button onClick={() => handlePassenger(ride._id)}>Passenger</button>
            </div>
          ))}
        </div>
        {showModal && (
          <div style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
          }}>
            <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", width: "90%", maxWidth: "400px", maxHeight: "80vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <h3>Passenger List</h3>
                <button onClick={() => setShowModal(false)} style={{ border: "none", background: "transparent", fontSize: "1.5rem", cursor: "pointer" }}>&times;</button>
              </div>
              {!passengers || passengers.length === 0 ? <p>No passengers found.</p> : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {passengers.map(p => (
                    <li key={p._id} style={{ borderBottom: "1px solid #171717", padding: "10px 0" }}>
                      <strong>Name:</strong> <Link to={`/chat/${p.passenger?._id}`}>{p.passenger?.name}</Link> <br/>
                      <strong>Phone:</strong> {p.passenger?.phone} <br/>
                      <strong>Seats:</strong> {p.bookingSeats} - <span style={{color: p.status === "confirmed" ? "green" : "orange"}}>{p.status}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PublicedRide;
