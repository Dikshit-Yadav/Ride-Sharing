import "../style/CreatRide.css"
import Navbar from "../components/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useEffect } from "react";
import LocationMap from "../components/LocationMap";
import { useRef } from "react";

function CreateRide() {
  const navigate = useNavigate();

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [price, setPrice] = useState("");
  const [seats, setSeats] = useState("");

  const [vehicleId, setVehicleId] = useState("");
  const [vehicle, setVehicle] = useState([]);

  const [selecting, setSelecting] = useState("source");
  const [sourceLoc, setSourceLoc] = useState(null);
  const [destLoc, setDestLoc] = useState(null);

  const getTodayDate = () => {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const year = today.getFullYear();

    return `${year}-${month}-${day}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [time, setTime] = useState(getCurrentTime());

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await API.get("/vehicle/my", { withCredentials: true })
        setVehicle(res.data.vehicles)
      } catch (err) {
        alert("register your vehicle first")
      }
    }

    fetchVehicle();
  }, [])

  const LOCATIONIQ_KEY = "pk.c3888526c247eef962f5eaa5f35860fb";

  let timerRef = useRef(null);
  const searchLocation = async (text, type) => {
    if (!text) return;

    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async() => {
    try {
      const res = await fetch(
        `https://api.locationiq.com/v1/search?key=${LOCATIONIQ_KEY}&q=${text}&format=json`
      );
      const data = await res.json();

      if (data.length > 0) {
        const place = {
          address: data[0].display_name,
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };

        type === "source" ? setSourceLoc(place) : setDestLoc(place);
      }
    } catch (err) {
      console.error("Location search failed");
    }
    }, 500)
  };

  

  const handelSubmit = async (e) => {
    e.preventDefault();

    if (!vehicleId) {
      alert("please select vehicle")
      return
    }

    try {
      await API.post("/ride/create", {
        date: selectedDate,
        time,
        price,
        source,
        destination,
        seats,
        vehicle: vehicleId
      }, { withCredentials: true })

      navigate("/")
    } catch (err) {
      alert("ride creation faild.", err)
    }
  }

  return (
    <>
      <Navbar />
      <div className="container">


        <div className="ride-layout">
          <div className="ride-form">


            <form onSubmit={handelSubmit}>
              <h2>Create Ride</h2>
              <input
                className="src"
                placeholder="Source"
                value={source}
                onFocus={() => setSelecting("source")}
                onChange={(e) => {
                  setSource(e.target.value);
                  searchLocation(e.target.value, "source");
                }}
                required
              />

              <input
                className="dest"
                placeholder="Destination"
                value={destination}
                onFocus={() => setSelecting("destination")}
                onChange={(e) => {
                  setDestination(e.target.value);
                  searchLocation(e.target.value, "destination");
                }}
                required
              />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={selectedDate}
                required
              />

              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Seats"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                required
              />

              <select value={vehicleId} onChange={e => setVehicleId(e.target.value)} required>
                <option>Select Vehicle</option>
                {vehicle.map(v => (
                  <option key={v._id} value={v._id}>{v.VhNumber}</option>
                ))}
              </select>

              <button type="submit">Create Ride</button>
            </form>
          </div>

          <div className="ride-map">
            <LocationMap
              location={selecting === "source" ? sourceLoc : destLoc}
              onSelect={(place) => {
                if (selecting === "source") {
                  setSource(place.address);
                  setSourceLoc(place);
                } else {
                  setDestination(place.address);
                  setDestLoc(place);
                }
              }}
            />
          </div>
        </div>
      </div>

    </>
  );
}

export default CreateRide;