import "../style/FindRide.css"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { useRef } from "react";

function FindRide() {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  // const [date, setDate] = useState("");
  const [seats, setSeats] = useState(1);
  const [rides, setRides] = useState([]);
  // const [similar, setSimilar] = useState([]);
  const [fromSuggeation, setFromSuggeation] = useState([]);
  const [toSuggeation, setToSuggeation] = useState([]);
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [searched, setSearched] = useState(false);

  const locationToken = "pk.c3888526c247eef962f5eaa5f35860fb";

  let timerRef = useRef(null);
  const location = async (query) => {
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
      const res = await fetch(`https://api.locationiq.com/v1/search?key=${locationToken}&q=${query}&format=json&&countrycodes=in`);
      const data = await res.json(); 
      return data;
    } catch (err) {
      console.error(err);
      return [];
    }
  },500)
  };



  const getTodayDate = () => {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const year = today.getFullYear();

    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const searchRides = async () => {
    setSearched(true);
    try {
      const res = await API.get("/ride/find", {
        params: {
          source: from,
          destination: to,
          date: selectedDate,
          seats
        },
        withCredentials: true
      });
      setRides(res.data.rides);
    } catch (err) {
      console.error(err);
    }
  };

  // const loadSimilarRides = async (id) => {
  //   try {
  //     const res = await API.get(`/ride/similar/${id}`, {
  //       withCredentials: true
  //     });
  //     setSimilar(res.data.similarRides);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  return (
    <>
      <Navbar />
      <div className="container">


        <div className="search-box">

          <div className="input-group">
            <h2 className="page-title">Find a Ride</h2>
            <input placeholder="From" value={from} onChange={(e) => {
              setFrom(e.target.value);
              setShowFrom(true);
              location(e.target.value).then(data => setFromSuggeation(data || []));
            }}
              onKeyDown={(e) => {
                if (e.key === "Enter") setShowFrom(false);
              }}
            />
            {fromSuggeation.length > 0 && showFrom && (
              <div className="suggestions">
                {fromSuggeation.map(s => (
                  <div key={s.place_id} onClick={() => {
                    setFrom(s.display_name);
                    setShowFrom(false);
                  }}>
                    {s.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="input-group">
            <input placeholder="To" value={to} onChange={(e) => {
              setTo(e.target.value);
              setShowTo(true);
              location(e.target.value).then(data => setToSuggeation(data || []));
            }}
              onKeyDown={(e) => {
                if (e.key === "Enter") setShowTo(false);
              }}
            />
            {toSuggeation.length > 0 && showTo && (
              <div className="suggestions">
                {toSuggeation.map(s => (
                  <div key={s.place_id} onClick={() => {
                    setTo(s.display_name);
                    setShowTo(false);
                  }}>
                    {s.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <input type="date" value={selectedDate} min={selectedDate}
            onChange={e => setSelectedDate(e.target.value)} />

          <input type="number" min="1" value={seats}
            onChange={e => setSeats(e.target.value)} />

          <button onClick={searchRides}>Search</button>
        </div>


        <h3 style={{
          position: "relative",
          bottom: "300px",
          left: "250px"
        }}>Available Rides</h3>
        {searched && rides.length === 0 ? (
          <p style={{
            position: "relative",
            bottom: "250px",
            left: "150px"
          }}>No rides found</p>
        ) : (

          <div className="rides-scroll">

            <div className="rides-grid">
              {rides.map(ride => (
                <div
                  className="ride-card"
                  key={ride._id}
                  // onClick={() => loadSimilarRides(ride._id)}
                >
                  <div className="ride-header">
                    <h4>{ride.source} → {ride.destination}</h4>
                    <span className="price">₹{ride.price}</span>
                  </div>

                  <div className="ride-info">
                    <p>Date: {ride.date}</p>
                    <p>Time: {ride.time}</p>
                    <p>Seats: {ride.seats}</p>
                    <p>Driver:{ride.driver.name}</p>
                  </div>

                  <button
                    className="book-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/ride/book", { state: { ride } });
                    }}
                  >
                    Book Ride
                  </button>

                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </>
  );
}

export default FindRide;
