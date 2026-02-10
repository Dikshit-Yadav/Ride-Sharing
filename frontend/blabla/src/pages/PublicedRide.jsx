import "../style/PublicedRide.css"
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function PublicedRide() { 
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRides = async () => {
      try {
        const res = await API.get("/ride/publiced");
        setRides(res.data.rides);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRides();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container">
        <h2 style={{
          position:"relative",
          bottom:"270px",
          left: "170px"
        }}>My Published Rides</h2>

        {loading && <p>Loading...</p>}

        {!loading && rides.length === 0 && (
          <p>You have not published any rides.</p>
        )}
        
        <div className="rides-list">
          {rides.map((ride) => (
            <div key={ride._id} className="ride-card">
              <h3>
                {ride.source} → {ride.destination}
              </h3>
              <p>Date: {ride.date} | Time:{ride.time}</p>
              <p>Price: ₹{ride.price}</p>
              <p>Seats Available: {ride.seats}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default PublicedRide;
