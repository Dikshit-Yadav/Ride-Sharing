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
        vehicle, setVehicle
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

    const searchLocation = async (text, type) => {
        if (!text) {
            return;
        }

        clearTimeout(timerRef.current)

        timerRef.current = setTimeout(async () => {
            try {
                const res = await fetch(`https://api.locationiq.com/v1/search?key=${LOCATIONIQ_KEY}&q=${text}&format=json`);

                const data = await res.json()

                if(data.length > 0){
                    const place = {
                        address: data[0].display_name,
                        lat: parseFloat(data[0].lat),
                        lng: parseFloat(data[0].lon),
                    }

                    type === "source" ? setSourceLoc(place): setDestLoc(place)
                }
            }catch(err){
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
                vehicle: vehicleId
            }, { withCredentials: true })

            navigate("/")
        } catch (err) {
            alert("ride creation faild.", err)
        }
    }

    return (
        <div className="ride-form">
            <form onSubmit={handelSubmit}>
                <h2>Create Ride</h2>

                <input placeholder="Source"
                    value={source}
                    onFocus={()=> setSelecting("source")}
                    onChange={(e) => {
                        setSource(e.target.value);
                        searchLocation(e.target.value, "source")
                    }}
                    required
                />

                <input placeholder="Destination"
                    value={destination}
                    onFocus={()=> setSelecting("destination")}
                    onChange={(e) =>{
                        setDestination(e.target.value);
                        searchLocation(e.target.value, "destination")
                    }
                    }
                    required
                />

                <input type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={selectedDate}
                    required
                />

                <input type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)} 
                    required/>

                <input type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />

                <input type="number"
                    placeholder="Seats"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    required
                />

                <select value={vehicleId} onChange={e=> setVehicleId(e.target.value)}required>

                    <option value="">Select Vehicle</option>
                    {vehicle.map(v=>(
                    <option key= {v._id} value={v._id}>{v.VhNumber}</option>
                    ))}
                </select>

                <button type="submit">Creat Ride</button>
            </form>
        </div>
    )
}

export default CreatRideForm;