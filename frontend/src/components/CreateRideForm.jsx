import { useRef, useEffect } from "react";
import { useRide } from "../context/RideContext"
import API from "../services/api"
import { useNavigate } from "react-router-dom"

function CreatRideForm() {

  const {
    source, setSource,
    destination, setDestination,
    price, setPrice,
    seats, setSeats,
    vehicleId, setVehicleId,
    sourceLoc, setSourceLoc,
    destLoc, setDestLoc,
    selectedDate, setSelectedDate,
    selecting, setSelecting,
    time, setTime,
    vehicle, setVehicle,
  } = useRide();

  const LOCATIONIQ_KEY = "pk.c3888526c247eef962f5eaa5f35860fb";
  const navigate = useNavigate();
  let timerRef = useRef(null)

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await API.get("/vehicle/my", { withCredentials: true });
        setVehicle(res.data.vehicles);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVehicles();
  }, [setVehicle]);

  const handlePreviewRoute = () => {
    if (!sourceLoc || !destLoc) {
      alert("Please enter source and destination");
      return;
    }

    setSelecting("preview");
  }


  let today = new Date().toISOString().split('T')[0];

  const searchLocation = async (text, type) => {
    if (!text) {
      return;
    }

    clearTimeout(timerRef.current)

    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.locationiq.com/v1/search?key=${LOCATIONIQ_KEY}&q=${text}&format=json`);

        const data = await res.json()

        if (data.length > 0) {
          const place = {
            address: data[0].display_name,
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          }

          type === "source" ? setSourceLoc(place) : setDestLoc(place)
        }
      } catch (err) {
        console.error("location search faild")
      }
    }, 500)
  }

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
        vehicle: vehicleId,
        sourceLoc,
        destLoc,
      }, { withCredentials: true })

      navigate("/")
    } catch (err) {
      alert("ride creation faild.", err)
    }
  }



  return (
    <div className="ride-form-container">
      <form className="ride-form" onSubmit={handelSubmit}>
        <h2>Create Ride</h2>

        <div className="form-grid">

          <div className="input-group">
            <label>From</label>
            <input
              placeholder="Source"
              value={source}
              onFocus={() => setSelecting("source")}
              onChange={(e) => {
                setSource(e.target.value);
                searchLocation(e.target.value, "source");
              }}
              required
            />
          </div>

          <div className="input-group">
            <label>To</label>
            <input
              placeholder="Destination"
              value={destination}
              onFocus={() => setSelecting("destination")}
              onChange={(e) => {
                setDestination(e.target.value);
                searchLocation(e.target.value, "destination");
              }}
              required
            />
          </div>

          <div className="input-group">
            <label>Date</label>
            <input
              type="date"
              value={selectedDate}
              min={today}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Price (₹)</label>
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Seats</label>
            <input
              type="number"
              placeholder="Seats"
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              required
            />
          </div>

          <div className="input-group full">
            <label>Select Vehicle</label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              required
            >
              <option value="">Select Vehicle</option>
              {vehicle?.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.VhNumber}
                </option>
              ))}
            </select>
          </div>

        </div>

        <button type="submit" className="create-btn">
          Create Ride
        </button>
        <button type="button" onClick={handlePreviewRoute}>
          Preview Route
        </button>
      </form>
    </div>
  )
}

export default CreatRideForm;
