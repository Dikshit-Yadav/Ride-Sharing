import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../style/VhStyle.css";

function VehicleRegister() {
  const navigate = useNavigate();

  const [VhNumber, setVhNumber] = useState("");
  const [VhModel, setVhModel] = useState("");
  const [TotalSeats, setTotalSeats] = useState("");
  const [vehicle, setVehicle] = useState([]);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await API.get("/vehicle/my", { withCredentials: true })
        setVehicle(res.data.vehicles)
      } catch (err) {
        alert("no vehicles register")
      }
    }

    fetchVehicle();
  }, [])

  const deleteVehicle = async (id) => {
    try {
      await API.delete(`/vehicle/delete/${id}`, { withCredentials: true })
      alert("Vehicle deleted successfully");
      setVehicle(vehicles => vehicles.filter(v => v._id !== id));
    }catch(err){
      alert("Vehicle deletion failed");
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await API.post(
        "/vehicle/register",
        { VhNumber, VhModel, TotalSeats },
        { withCredentials: true }
      );

      alert("Vehicle registered successfully");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Vehicle registration failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="vehicle-page">

        <div className="all-vh">
          <h2>My Vehicles</h2>
          {vehicle.map(v => (
            <div className="vhCard" key={v._id}>
              <strong>Vehicle Number:</strong> {v.VhNumber} <br />
              <strong>Vehicle Model:</strong> {v.VhModel} <br />
              <strong>Total Seats:</strong> {v.TotalSeats} <br />
              <strong>Driver:</strong> {v.user.name}
              <br /><br />
              <button onClick={() => deleteVehicle(v._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>

        <div className="form-section">
          <form onSubmit={submitHandler}>
            <h2>Register Vehicle</h2>

            <input
              type="text"
              placeholder="Vehicle Number"
              value={VhNumber}
              onChange={(e) => setVhNumber(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Vehicle Model"
              value={VhModel}
              onChange={(e) => setVhModel(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Total Seats"
              value={TotalSeats}
              onChange={(e) => setTotalSeats(e.target.value)}
              required
            />

            <button type="submit">Register Vehicle</button>
          </form>
        </div>

      </div>
    </>

  );
}

export default VehicleRegister;
